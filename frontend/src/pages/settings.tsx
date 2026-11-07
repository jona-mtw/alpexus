import "./settings.css";

function Settings() {
  return (
    <>
      <div className="settings">
        <h1>Settings</h1>
        <div className="settings-section">
          <div className="username">
            <h2>Username: </h2>
            <input type="text" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
