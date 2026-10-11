import "./storage-panel.css";

function StorageContainer() {
  return (
    <>
      <div className="storage-container">
        <h2>Storage</h2>
        <div className="storage-gauge">
          <div className="gauge"></div>
          <h4>9.4GB</h4>
          <p>of 15GB capacity</p>
        </div>
        <div className="storage-info"></div>
      </div>
    </>
  );
}

export default StorageContainer;
