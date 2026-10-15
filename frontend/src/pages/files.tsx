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

function Files() {
  const files: FileItem[] = [
    { id: "f1", name: "Pictures", type: "folder", fileType: null, parentId: null, size: 500, modified: "2/2/26", starred: true },
    { id: "f2", name: "Videos", type: "folder", fileType: null, parentId: null, size: 500, modified: "2/2/26", starred: true },
  ];
  return (
    <>
      <div className="files">
        <div className="files-section">
          <h1>Files</h1>
          <div className="file-manager"></div>
        </div>
      </div>
      <div className="files-sidebar">
        <StorageContainer />
      </div>
    </>
  );
}

export default Files;
