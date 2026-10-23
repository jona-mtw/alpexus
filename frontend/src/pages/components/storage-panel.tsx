import { useEffect, useState } from "react";
import "./storage-panel.css";

type DirectoryEntry = {
  path: string;
  name: string;
  type: "file" | "folder";
  dateModified: string;
  size: number;
  fileType: string;
  fileNo: number;
};

function formatSize(sizeBytes: number): string {
  let units = ["B", "KB", "MB", "GB"];
  let outputUnit: string = "B";

  for (const unit of units) {
    if (sizeBytes < 1000) {
      outputUnit = unit;
      break;
    }
    outputUnit = unit;
    sizeBytes /= 1000;
  }
  return `${sizeBytes.toFixed(1)}${outputUnit}`;
}

function StorageContainer() {
  const capacity = 2 * 1000 ** 3;

  const [totalSize, setTotalSize] = useState(0);
  const [totalFileNo, setTotalFileNo] = useState(0);

  const [totalImgSize, setImgTotalSize] = useState(0);
  const [imgFileNo, setImgFileNo] = useState(0);

  const [totalDocSize, setDocTotalSize] = useState(0);
  const [docFileNo, setDocFileNo] = useState(0);

  const [totalMediaSize, setMediaTotalSize] = useState(0);
  const [mediaFileNo, setMediaFileNo] = useState(0);

  useEffect(() => {
    async function fetchStorageSize() {
      const response = await fetch(`http://localhost:3000/api/files?path=`);
      const files = await response.json();
      setTotalSize(files.reduce((total: number, file: DirectoryEntry) => (total += file.size), 0));
      setTotalFileNo(
        files.reduce((total: number, file: DirectoryEntry) => (total += file.fileNo), 0),
      );
    }

    async function getTotalImgFilesSize() {
      const imgFiles = ["jpg", "jpeg", "png", "webp", "svg"];
      let totalSize = 0;
      let fileNo = 0;

      for (const imgFileExtension of imgFiles) {
        const response = await fetch(
          `http://localhost:3000/api/files?fileType=${imgFileExtension}`,
        );
        const files = await response.json();
        totalSize += files.reduce((total: number, file: DirectoryEntry) => (total += file.size), 0);
        fileNo += files.reduce((total: number, file: DirectoryEntry) => (total += file.fileNo), 0);
      }

      setImgTotalSize(totalSize);
      setImgFileNo(fileNo);
    }

    async function getTotalDocumentFilesSize() {
      const docFiles = ["docx", "pdf"];
      let totalSize = 0;
      let fileNo = 0;

      for (const docFileExtension of docFiles) {
        const response = await fetch(
          `http://localhost:3000/api/files?fileType=${docFileExtension}`,
        );
        const files = await response.json();
        totalSize += files.reduce((total: number, file: DirectoryEntry) => (total += file.size), 0);
        fileNo += files.reduce((total: number, file: DirectoryEntry) => (total += file.fileNo), 0);
      }

      setDocTotalSize(totalSize);
      setDocFileNo(fileNo);
    }

    async function getMediaFilesSize() {
      const mediaFiles = ["mp3", "mp4"];
      let totalSize = 0;
      let fileNo = 0;

      for (const mediaFileExtension of mediaFiles) {
        const response = await fetch(
          `http://localhost:3000/api/files?fileType=${mediaFileExtension}`,
        );
        const files = await response.json();
        totalSize += files.reduce((total: number, file: DirectoryEntry) => (total += file.size), 0);
        fileNo += files.reduce((total: number, file: DirectoryEntry) => (total += file.fileNo), 0);
      }

      setMediaTotalSize(totalSize);
      setMediaFileNo(fileNo);
    }

    fetchStorageSize();
    getTotalImgFilesSize();
    getTotalDocumentFilesSize();
    getMediaFilesSize();
  }, []);

  return (
    <>
      <div className="storage-container">
        <h2>Storage</h2>
        <div
          className="storage-gauge"
          style={{
            background: `conic-gradient(
              #7765E3 0% ${(totalSize / capacity) * 100}%,
              #30364B ${(totalSize / capacity) * 100}% 100%
            )`,
          }}
        >
          <div className="gauge">
            <h4>{formatSize(totalSize)}</h4>
            <p>of {formatSize(capacity)} capacity</p>
          </div>
        </div>
        <div className="storage-detailed-info">
          <div className="storage-info">
            <div className="storage-info-header-wrapper">
              <i className="fa-solid fa-image"></i>
              <div className="storage-info-header">
                <h4>Images</h4>
                <p>{imgFileNo} files</p>
              </div>
            </div>
            <p className="storage-size">{formatSize(totalImgSize)}</p>
          </div>
          <div className="storage-info">
            <div className="storage-info-header-wrapper">
              <i className="fa-solid fa-file-lines"></i>
              <div className="storage-info-header">
                <h4>Documents</h4>
                <p>{docFileNo} files</p>
              </div>
            </div>
            <p className="storage-size">{formatSize(totalDocSize)}</p>
          </div>
          <div className="storage-info">
            <div className="storage-info-header-wrapper">
              <i className="fa-brands fa-youtube"></i>
              <div className="storage-info-header">
                <h4>Media</h4>
                <p>{mediaFileNo} files</p>
              </div>
            </div>
            <p className="storage-size">{formatSize(totalMediaSize)}</p>
          </div>
          <div className="storage-info">
            <div className="storage-info-header-wrapper">
              <i className="fa-solid fa-file-zipper"></i>
              <div className="storage-info-header">
                <h4>Other Files</h4>
                <p>{totalFileNo - (imgFileNo + docFileNo + mediaFileNo)} files</p>
              </div>
            </div>
            <p className="storage-size">
              {formatSize(totalSize - (totalImgSize + totalDocSize + totalMediaSize))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default StorageContainer;
