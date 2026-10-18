import { useEffect, useState } from "react";
import "./files.css";
import File from "./components/file.tsx";
import StorageContainer from "./components/storage-panel.tsx";

type DirectoryEntry = {
  path: string;
  name: string;
  type: "file" | "folder";
  dateModified: string;
  size: number;
  fileType: string;
};

function Files() {
  const [filePath, setFilePath] = useState("86/anime_only/");
  const [files, setFiles] = useState<DirectoryEntry[]>([]);
  useEffect(() => {
    fetch(`http://localhost:3000/api/files?path=${encodeURIComponent(filePath)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch files!");
        } else {
          console.log("Files fetched");
        }
        return response.json();
      })
      .then((data) => {
        setFiles(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [filePath]);

  return (
    <>
      <div className="files">
        <div className="files-section">
          <h1>Files</h1>
          <div className="files-quick-access"></div>
          <div className="file-manager">
            {files.map((file) => (
              <div className={file.name} key={file.name}>
                <p>{`${file.type}: ${file.name}`}</p>
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
