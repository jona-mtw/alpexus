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

async function getDirectoryContents(relativePath: string, pathString: string): Promise<FileEntry[]> {
	const children = await fs.readdir(pathString, {withFileTypes: true})
	
	const outputFileDir: FileEntry[] = [];

	for (const child of children) {
		const stats = await fs.stat(path.join(pathString, child.name));
		outputFileDir.push({
			path: path.join(relativePath, child.name),
			name: path.parse(child.name).name, 
			type: child.isDirectory() ? "folder" : "file", 
			dateModified: stats.mtime, 
			size: stats.size, 
			fileType: path.extname(child.name).toLowerCase().slice(1)
		})
	}

	return outputFileDir;
}

app.get("/api/files", async (req, res) => {
	const requestedPath = typeof req.query.path === "string" ? req.query.path : "";
	const targetPath = path.resolve(STORAGE, requestedPath);
	const relativePath = path.relative(STORAGE, targetPath)

	if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`)){
		res.status(403).json({ error: "Access Denied" });
		return;
	}
	try {
		const result = await getDirectoryContents(relativePath, targetPath);
		console.log(result);
		res.json(result);
	} catch {
		res.status(404).json({ error: "Directory not found" });
	}

});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

