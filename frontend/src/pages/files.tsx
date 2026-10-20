import { Fragment, useEffect, useState } from "react";
import "./files.css";
import File from "./components/file.tsx";

type DirectoryEntry = {
  path: string;
  name: string;
  type: "file" | "folder";
  dateModified: string;
  size: number;
  fileType: string;
};

function Files() {
  const [filePath, setFilePath] = useState("");
  const [files, setFiles] = useState<DirectoryEntry[]>([]);
  useEffect(() => {
    fetch(`http://localhost:3000/api/files?path=${encodeURIComponent(filePath)}`)
      .then((response) => {
        if (response.ok) {
          console.log("Files fetched");
        } else {
          throw new Error("Failed to fetch files");
        }
        return response.json();
      })
      .then((data) => setFiles(data))
      .catch((error) => console.error(error));
  }, [filePath]);

  const splitFilePath = filePath.split(/[\\/]/).filter(Boolean);

  return (
    <>
      <div className="files">
        <div className="files-section">
          <h1>Files</h1>
          <div className="file-manager">
            <div className="path-header">
              <h2 onClick={() => setFilePath("")}>Storage</h2>
              {splitFilePath.map((folderPath, index) => {
                const fullPath = splitFilePath.slice(0, index + 1).join("\\");
                return (
                  <Fragment key={fullPath}>
                    <h2>{">"}</h2>
                    <h2 onClick={() => setFilePath(fullPath)}>{folderPath}</h2>
                  </Fragment>
                );
              })}
            </div>
            {files.map((file) => (
              <File
                key={file.path + file.name}
                name={file.name}
                type={file.type}
                fileType={file.fileType}
                size={file.size}
                date={file.dateModified}
                onClick={() => {
                  if (file.type == "folder") {
                    setFilePath(file.path);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Files;
