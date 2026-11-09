import { useState } from "react";
import "./settings.css";

function Settings() {
  const [username, setUsername] = useState("");
  const [capacity, setCapacity] = useState(0);

  async function saveUsername() {
    await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
  }

  async function saveCapacity() {
    await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ capacity }),
    });
  }

  return (
    <>
      <div className="settings">
        <div className="settings-section">
          <h1>Settings</h1>
          <div className="username-wrapper">
            <label htmlFor="username">
              <p>Username</p>
            </label>
            <input
              type="text"
              name="username"
              className="username"
              placeholder="enter name: "
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
            <button onClick={saveUsername}>Save username</button>
          </div>
          <div className="capacity-wrapper">
            <label htmlFor="totalCapacity">
              <p>File Capacity</p>
            </label>
            <input
              type="text"
              name="totalCapacity"
              placeholder="GB"
              onChange={(event) => setCapacity(Number(event.currentTarget.value) * 1_000_000_000)}
            />
            <button onClick={saveCapacity}>Save capacity</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
