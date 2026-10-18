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
    fetch("http://localhost:3000/api/files?path=86/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch files!");
        }
        return response.json();
      })
      .then((data) => {
        setFiles(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="files">
        <div className="files-section">
          <h1>Files</h1>
          <div className="files-quick-access"></div>
          <div className="file-manager">
            {files.map((file) => (
              <div className={file.name} key={file.name}>
                <p>{file.name}</p>
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
