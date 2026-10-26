import fs from "node:fs/promises";
import path from "node:path";
import express, { type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config.js";
import { Readable } from "node:stream";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const STORAGE = path.resolve("storage");

//#region Files
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
//#endregion

//#region JellyFin
function getJellyfinConfig() {
  const url = process.env.JELLYFIN_URL;
  const apiKey = process.env.JELLYFIN_API_KEY;

  if (!url || !apiKey) {
    throw new Error("Jellyfin Config is missing");
  }
  return { url, apiKey };
}

async function fetchJellyfin(endpoint: string, extraHeaders: Record<string, string> = {}) {
  const { url, apiKey } = getJellyfinConfig();

  return fetch(`${url}${endpoint}`, {
    headers: {
      Authorization: `MediaBrowser Token=${apiKey}`,
      ...extraHeaders,
    },
  });
}

async function getMediaItems(includeItemTypes: string) {
  const params = new URLSearchParams({
    Recursive: "true",
    IncludeItemTypes: includeItemTypes,
    Fields: "Overview,ProductionYear,Genres",
  });

  const response = await fetchJellyfin(`/Items?${params}`);

  if (!response.ok) {
    throw new Error(`Jellyfin returned status ${response.status}`);
  }

  const data = (await response.json()) as {
    Items?: unknown[];
  };

  return data.Items ?? [];
}

function mediaItemsHandler(includeItemTypes: string = "Audio,Movie,Episode,Video,MusicVideo") {
  return async (_req: Request, res: Response) => {
    try {
      res.json(await getMediaItems(includeItemTypes));
    } catch (error) {
      console.error("Failed to fetch media: ", error);

      res.status(502).json({
        error: "Failed to fetch media from Jellyfin",
      });
    }
  };
}

app.get("/api/media", mediaItemsHandler());

app.get("/api/media/songs", mediaItemsHandler("Audio"));

app.get("/api/media/albums", mediaItemsHandler("MusicAlbum"));

app.get("/api/media/:itemId/stream", async (req, res) => {
  const { itemId } = req.params;
  const type = req.query.type === "video" ? "video" : "audio";

  const endpoint =
    type === "video"
      ? `/Videos/${encodeURIComponent(itemId)}/stream`
      : `/Audio/${encodeURIComponent(itemId)}/stream`;

  const response = await fetchJellyfin(
    endpoint,
    req.headers.range ? { Range: req.headers.range } : {},
  );

  if (!response.ok || !response.ok) {
    res.sendStatus(response.status || 502);
    return;
  }

  response.headers.forEach((value, key) => {
    if (
      ["content-type", "content-length", "content-range", "accept-ranges"].includes(
        key.toLowerCase(),
      )
    ) {
      res.setHeader(key, value);
    }
  });

  res.status(response.status);
  Readable.fromWeb(response.body as import("node:stream/web").ReadableStream).pipe(res);
});

app.get("/api/media/:itemId/cover", async (req, res) => {
  const { itemId } = req.params;
  const endpoint = `/Items/${itemId}/Images/Primary`;

  const response = await fetchJellyfin(endpoint);

  if (!response.ok || !response.body) {
    res.sendStatus(response.status || 404);
    return;
  }

  res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");

  res.status(response.status);
  Readable.fromWeb(response.body as import("node:stream/web").ReadableStream).pipe(res);
});
//#endregion

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
