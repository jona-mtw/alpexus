import { useEffect, useState } from "react";
import "./files.css";
import StorageContainer from "./components/storage-panel.tsx";

type FileItem = {
  id: string;
  name: string;
  type: string;
  fileType: string | null;
  parentId: string | null;
  size: number;
  modified: string;
  starred: boolean;
};

type DirectoryEntry = {
  name: string;
  type: "file" | "folder";
};

function Files() {
  const [files, setFiles] = useState<DirectoryEntry[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/files?path=86")
      .then((response) => response.json())
      .then((data) => {
        setFiles(data);
      });
  });

  return (
    <>
      <div className="files">
        <div className="files-section">
          <h1>Files</h1>
          <div className="files-quick-access"></div>
          <div className="file-manager">
            {files.map((file) => (
              <div key={file.name}>
                {file.type === "folder" ? "📁" : "📄"} {file.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="files-sidebar">
        <StorageContainer />
      </div>
    </>
  );
}

export default Files;
