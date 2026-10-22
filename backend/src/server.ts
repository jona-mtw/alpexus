import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const STORAGE = path.resolve("storage");

type FileEntry = {
	path: string,
	name: string,
	type: "file" | "folder",
	dateModified: Date,
	size: number,
	fileType: string
};

async function getFileSize(folderPath: string, fileType: string = ""): Promise<number> {
	const children = await fs.readdir(folderPath, {withFileTypes: true});
	let totalSize = 0;

	for (const child of children) {
		const childPath = path.join(folderPath, child.name);
		if (child.isDirectory()) {totalSize += await getFileSize(childPath, fileType)}
		else if (child.isFile()) {
			if (fileType === ""){
				const stats = await fs.stat(childPath);
				totalSize += stats.size;
			} else if (path.extname(child.name).toLowerCase().slice(1) === fileType) {
				const stats = await fs.stat(childPath);
				totalSize += stats.size;
			}
		}
	}

	return totalSize
}

async function getDirectoryContents(relativePath: string = "", pathString: string = STORAGE, needSize: boolean = true, fileType: string = ""): Promise<FileEntry[]> {
	const children = await fs.readdir(pathString, {withFileTypes: true})
	
	const outputFileDir: FileEntry[] = [];

	for (const child of children) {
		const stats = await fs.stat(path.join(pathString, child.name));
		outputFileDir.push({
			path: path.join(relativePath, child.name),
			name: path.parse(child.name).name, 
			type: child.isDirectory() ? "folder" : "file", 
			dateModified: stats.mtime, 
			size: needSize ? child.isDirectory() ? await getFileSize(path.join(pathString, child.name), fileType) : stats.size : 0, 
			fileType: path.extname(child.name).toLowerCase().slice(1)
		})
	}

	return outputFileDir;
}

async function getRecentFiles(): Promise<FileEntry[]> {
	async function getAllFiles(relativePath = ""): Promise<FileEntry[]> {
		const entries: FileEntry[] = await getDirectoryContents(relativePath, path.resolve(STORAGE, relativePath), false);

		const allFiles: FileEntry[] = [];

		for (const entry of entries) {
			if (entry.type === "file") {
				allFiles.push(entry);
			} else {
				allFiles.push(... await getAllFiles(entry.path));
			}
		}
		return allFiles;
	} 

	const files = await getAllFiles()
	const mostRecentFiles: FileEntry[]  = files.sort((a, b) => b.dateModified.getTime() - a.dateModified.getTime()).slice(0, 10);

	for (const file of mostRecentFiles) {
    const stats = await fs.stat(
      path.resolve(STORAGE, file.path)
    );

    file.size = stats.size;
  }
	
	return mostRecentFiles; 
}

app.get("/api/files", async (req, res) => {
	const requestedPath = typeof req.query.path === "string" ? req.query.path : "";
	const targetPath = path.resolve(STORAGE, requestedPath);
	const relativePath = path.relative(STORAGE, targetPath)
	const reqFileType = typeof req.query.fileType === "string" ? req.query.fileType : "";

	if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`)){
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
		res.status(500).json({error: "Failed to fetch recent files"});
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

