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

function File(props: FileProps) {
  const { bg = true } = props;

  return (
    <>
      <div className={!bg ? "individual-file with-bg" : "individual-file"} onClick={props.onClick}>
        <div className="individual-file-left-wrapper">
          <p className="file-name">{props.name}</p>
          <div className="individual-file-left-wrapper-bottom">
            <p className="file-size">{(props.size / 1000000).toFixed(1) + "MB"}</p>
            <p className={props.type == "folder" ? "is-folder" : ""}>·</p>
            <p className={props.type == "folder" ? "file-type is-folder" : "file-type"}>
              {props.fileType}
            </p>
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
