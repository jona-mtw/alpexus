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
	name: string,
	type: "file" | "folder"
};

async function getDirectoryContents(pathString: string): Promise<FileEntry[]> {
	const children = await fs.readdir(pathString, {withFileTypes: true})

	let folderCounter: number = 0;
	let fileCounter: number = 0;
	
	const outputFileDir: FileEntry[] = [];

	children.forEach((child) => {
		if (child.isDirectory()) {
			folderCounter ++;
			outputFileDir.push({name: child.name, type: "folder"})
		} else if (child.isFile()) {
			fileCounter ++;
			outputFileDir.push({name: child.name, type: "file"})
		}
	})

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
		const result = await getDirectoryContents(targetPath);
		res.json(result);
	} catch {
		res.status(404).json({ error: "Directory not found" });
	}

});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

