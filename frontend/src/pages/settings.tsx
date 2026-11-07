import "./settings.css";

function Settings() {
  return (
    <>
      <div className="settings">
        <div className="settings-section">
          <h1>Settings</h1>
          <div className="username-wrapper">
            <label htmlFor="username">
              <p>Username: </p>
            </label>
            <input type="text" name="username" className="username" placeholder="enter name: " />
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
