import "./file.css";

function File(props: { name: string; fileType: string; size: number; date: string; bg?: boolean }) {
  const { bg = true } = props;

  return (
    <>
      <div className={!bg ? "individual-file with-bg" : "individual-file"}>
        <div className="individual-file-left-wrapper">
          <p className="file-name">{props.name}</p>
          <div
            className={
              props.fileType == ""
                ? "individual-file-left-wrapper-bottom is-folder"
                : "individual-file-left-wrapper-bottom"
            }
          >
            <p className="file-size">{(props.size / 1000000).toFixed(1) + "MB"}</p>
            <p>·</p>
            <p className="file-type">{props.fileType}</p>
          </div>
        </div>
        <p className="file-date">{props.date}</p>
      </div>
    </>
  );
}

export default File;
