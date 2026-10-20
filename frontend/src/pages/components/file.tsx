import "./file.css";

type FileProps = {
  name: string;
  fileType: string;
  type: "file" | "folder";
  size: number;
  date: string;
  bg?: boolean;
  onClick?: () => void;
};

const fileIcons = {
  folder: <i className="fa-solid fa-folder-open"></i>,
  pdf: <i className="fa-solid fa-file-pdf"></i>,
  img: <i className="fa-solid fa-file-image"></i>,
  video: <i className="fa-solid fa-file-video"></i>,
  audio: <i className="fa-solid fa-file-audio"></i>,
  word: <i className="fa-solid fa-file-word"></i>,
  excel: <i className="fa-solid fa-file-excel"></i>,
  powerpoint: <i className="fa-solid fa-file-powerpoint"></i>,
  zip: <i className="fa-solid fa-file-zipper"></i>,
  code: <i className="fa-solid fa-file-code"></i>,
  otherFile: <i className="fa-solid fa-file"></i>,
};

function getIcon(file: FileProps) {
  if (file.type == "folder") {
    return fileIcons.folder;
  } else {
    if (file.fileType == "pdf") {
      return fileIcons.pdf;
    } else if (file.fileType == "docx") {
      return fileIcons.word;
    } else if (file.fileType == "pptx") {
      return fileIcons.powerpoint;
    } else {
      return fileIcons.otherFile;
    }
  }
}

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

function File(props: FileProps) {
  const { bg = true } = props;

  return (
    <>
      <div className={!bg ? "individual-file with-bg" : "individual-file"} onClick={props.onClick}>
        <div className="individual-file-left-wrapper">
          <div className="file-icon">{getIcon(props)}</div>
          <div className="vertical-wrapper">
            <p className="file-name">{props.name}</p>
            <div className="individual-file-left-wrapper-bottom">
              <p className="file-size">{formatSize(props.size)}</p>
              <p className={props.type == "folder" || props.fileType == "" ? "is-folder" : ""}>·</p>
              <p
                className={
                  props.type == "folder" || props.fileType == ""
                    ? "file-type is-folder"
                    : "file-type"
                }
              >
                {props.fileType}
              </p>
            </div>
          </div>
        </div>
        <p className="file-date">
          {new Date(props.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </>
  );
}

export default File;
