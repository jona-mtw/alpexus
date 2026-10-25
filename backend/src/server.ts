import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import cors from "cors";
import "dotenv/config.js";
import { Readable } from "node:stream";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const STORAGE = path.resolve("storage");

type FileEntry = {
  path: string;
  name: string;
  type: "file" | "folder";
  dateModified: Date;
  size: number;
  fileType: string;
  fileNo: number;
};

async function getFileSize(folderPath: string, fileType: string = ""): Promise<number[]> {
  const children = await fs.readdir(folderPath, { withFileTypes: true });
  let totalSize = 0;
  let fileNo = 0;

  for (const child of children) {
    const childPath = path.join(folderPath, child.name);
    if (child.isDirectory()) {
      const [childSize, childNo] = await getFileSize(childPath, fileType);
      totalSize += childSize;
      fileNo += childNo;
    } else if (child.isFile()) {
      if (fileType === "") {
        const stats = await fs.stat(childPath);
        totalSize += stats.size;
        fileNo++;
      } else if (path.extname(child.name).toLowerCase().slice(1) === fileType) {
        const stats = await fs.stat(childPath);
        totalSize += stats.size;
        fileNo++;
      }
    }
  }

  return [totalSize, fileNo];
}

async function getDirectoryContents(
  relativePath: string = "",
  pathString: string = STORAGE,
  needSize: boolean = true,
  fileType: string = "",
): Promise<FileEntry[]> {
  const children = await fs.readdir(pathString, { withFileTypes: true });

  const outputFileDir: FileEntry[] = [];

  for (const child of children) {
    const stats = await fs.stat(path.join(pathString, child.name));
    const fileSize = child.isDirectory()
      ? await getFileSize(path.join(pathString, child.name), fileType)
      : [
          stats.size,
          fileType === "" || path.extname(child.name).toLowerCase().slice(1) === fileType ? 1 : 0,
        ];
    outputFileDir.push({
      path: path.join(relativePath, child.name),
      name: path.parse(child.name).name,
      type: child.isDirectory() ? "folder" : "file",
      dateModified: stats.mtime,
      size: needSize ? (child.isDirectory() ? fileSize[0] : stats.size) : 0,
      fileType: path.extname(child.name).toLowerCase().slice(1),
      fileNo: fileSize[1],
    });
  }

  return outputFileDir;
}

async function getRecentFiles(): Promise<FileEntry[]> {
  async function getAllFiles(relativePath = ""): Promise<FileEntry[]> {
    const entries: FileEntry[] = await getDirectoryContents(
      relativePath,
      path.resolve(STORAGE, relativePath),
      false,
    );

    const allFiles: FileEntry[] = [];

    for (const entry of entries) {
      if (entry.type === "file") {
        allFiles.push(entry);
      } else {
        allFiles.push(...(await getAllFiles(entry.path)));
      }
    }
    return allFiles;
  }

  const files = await getAllFiles();
  const mostRecentFiles: FileEntry[] = files
    .sort((a, b) => b.dateModified.getTime() - a.dateModified.getTime())
    .slice(0, 10);

  for (const file of mostRecentFiles) {
    const stats = await fs.stat(path.resolve(STORAGE, file.path));

    file.size = stats.size;
  }

  return mostRecentFiles;
}

app.get("/api/files", async (req, res) => {
  const requestedPath = typeof req.query.path === "string" ? req.query.path : "";
  const targetPath = path.resolve(STORAGE, requestedPath);
  const relativePath = path.relative(STORAGE, targetPath);
  const reqFileType = typeof req.query.fileType === "string" ? req.query.fileType : "";

  if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`)) {
    res.status(403).json({ error: "Access Denied" });
    return;
  }
  try {
    const result = await getDirectoryContents(relativePath, targetPath, true, reqFileType);
    console.log(result);
    res.json(result);
  } catch {
    res.status(404).json({ error: "Directory not found" });
  }
});

app.get("/api/files/recent", async (_req, res) => {
  try {
    const result = await getRecentFiles();
    res.json(result);
    console.log(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recent files" });
  }
});

app.get("/api/media", async (_req, res) => {
  const jellyfinUrl = process.env.JELLYFIN_URL;
  const apiKey = process.env.JELLYFIN_API_KEY;

  if (!jellyfinUrl || !apiKey) {
    res.status(500).json({
      error: "Jellyfin Config is missing",
    });
    return;
  }

  try {
    const response = await fetch(
      `${jellyfinUrl}/Items?Recursive=true&IncludeItemTypes=Audio&Fields=Overview,ProductionYear,Genres`,
      {
        headers: {
          Authorization: `MediaBrowser Token="${apiKey}"`,
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();

      console.error("Jellyfin status:", response.status);
      console.error("Jellyfin response:", errorBody);

      res.status(response.status).json({
        error: "Jellyfin request failed",
        status: response.status,
        details: errorBody,
      });

      return;
    }
    const data = await response.json();
    res.json(data.Items ?? []);
  } catch (error) {
    console.error("Jellyfin error: ", error);

    res.status(502).json({
      error: "Could not connect to Jellyfin",
    });
  }
});

app.get("/api/media/:itemId/stream", async (req, res) => {
  const jellyfinUrl = process.env.JELLYFIN_URL;
  const apiKey = process.env.JELLYFIN_API_KEY;

  if (!jellyfinUrl || !apiKey) {
    res.status(500).json({ error: "Jellyfin config is missing" });
    return;
  }

  try {
    const { itemId } = req.params;
    const headers: Record<string, string> = {
      Authorization: `MediaBrowser Token="${apiKey}"`,
    };
    if (req.headers.range) {
      headers.Range = req.headers.range;
    }

    const response = await fetch(`${jellyfinUrl}/Audio/${encodeURIComponent(itemId)}/stream`, {
      headers,
    });
    if (!response.ok || !response.body) {
      res.sendStatus(response.status || 502);
      return;
    }

    for (const name of ["content-type", "content-length", "content-range", "accept-ranges"]) {
      const value = response.headers.get(name);

      if (value) {
        res.setHeader(name, value);
      }
    }

    res.status(response.status);

    const stream = Readable.fromWeb(
      response.body as unknown as import("node:stream/web").ReadableStream,
    );

    stream.on("error", (error) => {
      console.error("Audio stream error:", error);

      if (!res.headersSent) {
        res.sendStatus(502);
      } else {
        res.destroy(error);
      }
    });

    stream.pipe(res);
  } catch (error) {
    console.error("Audio streaming failed:", error);

    if (!res.headersSent) {
      res.sendStatus(500);
    } else {
      res.end();
    }
  }
});

app.get("/api/media/:itemId/cover", async (req, res) => {
  const jellyfinUrl = process.env.JELLYFIN_URL;
  const apiKey = process.env.JELLYFIN_API_KEY;

  if (!jellyfinUrl || !apiKey) {
    res.status(500).json({ error: "Jellyfin config is missing" });
    return;
  }

  try {
    const { itemId } = req.params;
    const headers: Record<string, string> = {
      Authorization: `MediaBrowser Token=${apiKey}`,
    };
    if (req.headers.range) {
      headers.Range = req.headers.range;
    }
    const response = await fetch(
      `${jellyfinUrl}/Items/${encodeURIComponent(itemId)}/Images/Primary`,
      {
        headers,
      },
    );
    if (!response.ok || !response.body) {
      res.sendStatus(response.status || 502);
      return;
    }
  } catch (error) {
    console.error("Fetching Cover Art Failed: ", error);

    if (!res.headersSent) {
      res.sendStatus(500);
    } else {
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
