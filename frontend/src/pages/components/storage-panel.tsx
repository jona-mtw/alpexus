import "./storage-panel.css";

function StorageContainer() {
  return (
    <>
      <div className="storage-container">
        <h2>Storage</h2>
        <div className="storage-gauge">
          <div className="gauge">
            <h4>9.4GB</h4>
            <p>of 15GB capacity</p>
          </div>
        </div>
        <div className="storage-detailed-info">
          <div className="photo storage-info">
            <div className="storage-info-header-wrapper">
              <i className="fa-solid fa-image"></i>
              <div className="storage-info-header">
                <h4>Images</h4>
                <p>54 files</p>
              </div>
            </div>
            <p className="storage-size">86MB</p>
          </div>
          <div className="documents storage-info">
            <div className="storage-info-header-wrapper">
              <i className="fa-solid fa-file-lines"></i>
              <div className="storage-info-header">
                <h4>Documents</h4>
                <p>54 files</p>
              </div>
            </div>
            <p className="storage-size">86MB</p>
          </div>
          <div className="media storage-info">
            <div className="storage-info-header-wrapper">
              <i className="fa-brands fa-youtube"></i>
              <div className="storage-info-header">
                <h4>Media</h4>
                <p>54 files</p>
              </div>
            </div>
            <p className="storage-size">86MB</p>
          </div>
          <div className="other storage-info">
            <div className="storage-info-header-wrapper">
              <i className="fa-solid fa-file-zipper"></i>
              <div className="storage-info-header">
                <h4>Other Files</h4>
                <p>54 files</p>
              </div>
            </div>
            <p className="storage-size">86MB</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default StorageContainer;
