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
  fileNo: number;
};

type FilesProps = {
  quickAccessFilePath?: string;
};

function Files({ quickAccessFilePath = "" }: FilesProps) {
  const [filePath, setFilePath] = useState(quickAccessFilePath);
  const [files, setFiles] = useState<DirectoryEntry[]>([]);
  const [refresh, setRefresh] = useState(0);
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
  }, [filePath, refresh]);

  const splitFilePath = filePath.split(/[\\/]/).filter(Boolean);

  async function uploadFile(file: globalThis.File) {
    const formData = new FormData();
    formData.append("path", filePath);
    formData.append("file", file);
    const response = await fetch("http://localhost:3000/api/files/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    console.log(data);
    setRefresh((previous) => previous + 1);
  }

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
          <div className="upload">
            <input
              id="file-upload"
              type="file"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (file) {
                  try {
                    await uploadFile(file);
                  } catch (error) {
                    console.error(error);
                  }
                }
                event.target.value = "";
              }}
            />
            <label htmlFor="file-upload" className="upload-button">
              <span>+</span> <p>Upload file</p>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Files;
