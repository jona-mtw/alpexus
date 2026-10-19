import { Fragment, useEffect, useState } from "react";
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
  const [filePath, setFilePath] = useState("");
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
      .then((data) => setFiles(data))
      .catch((error) => console.error(error));
  }, [filePath]);

  const [splitFilePath, setSplitFilePath] = useState<string[]>([]);

  useEffect(() => {
    setSplitFilePath(filePath.split("\\"));
    console.log(splitFilePath);
  }, [filePath]);

  return (
    <>
      <div className="files">
        <div className="files-section">
          <h1>Files</h1>
          {/* <div className="files-quick-access"></div> */}
          <div className="file-manager">
            <div className="path-header">
              <h2 onClick={() => setFilePath("")}>Storage</h2>
              {splitFilePath.map((folderPath) => (
                <>
                  <h2 key={folderPath + "chevron"}>{">"}</h2>
                  <h2 key={folderPath} onClick={() => setFilePath(folderPath)}>
                    {folderPath}
                  </h2>
                </>
              ))}
            </div>
            {files.map((file) => (
              <File
                key={file.path + file.name}
                name={file.name}
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
      <div className="files-sidebar">
        <StorageContainer />
      </div>
    </>
  );
}

export default Files;
