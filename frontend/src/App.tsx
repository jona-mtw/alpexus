import { useState } from "react";
import "./App.css";

import Home from "./pages/home.tsx";
import Files from "./pages/files.tsx";
import Media from "./pages/media.tsx";
import Notes from "./pages/notes.tsx";
import Passwords from "./pages/passwords.tsx";
import Settings from "./pages/settings.tsx";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pages: React.ComponentType[] = [Home, Files, Passwords, Notes, Media, Settings];
  const [pageNo, setPageNo] = useState(0);
  const ActivePage = pages[pageNo];

  return (
    <div className="app-container">
      <nav className={sidebarOpen ? "sidebar open" : "sidebar closed"}>
        <span id="nav-bar-title" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className="fa-solid fa-cloud fa-xl"></i>
          <h1>ALPEXUS</h1>
        </span>
        <ul id="nav-bar-links">
          <li className="nav-bar-link">
            <span onClick={() => setPageNo(0)}>
              <i className="fa-solid fa-house fa-xl"></i>
              <p className="nav-bar-text">home</p>
            </span>
          </li>
          <li className="nav-bar-link">
            <span onClick={() => setPageNo(1)}>
              <i className="fa-solid fa-folder-open fa-xl"></i>
              <p className="nav-bar-text">files</p>
            </span>
          </li>
          <li className="nav-bar-link">
            <span onClick={() => setPageNo(2)}>
              <i className="fa-solid fa-lock fa-xl"></i>
              <p className="nav-bar-text">passwords</p>
            </span>
          </li>
          <li className="nav-bar-link">
            <span onClick={() => setPageNo(3)}>
              <i className="fa-solid fa-note-sticky fa-xl"></i>
              <p className="nav-bar-text">notes</p>
            </span>
          </li>
          <li className="nav-bar-link">
            <span onClick={() => setPageNo(4)}>
              <i className="fa-solid fa-image fa-xl"></i>
              <p className="nav-bar-text">media</p>
            </span>
          </li>
        </ul>
        <span className="nav-bar-link" id="nav-bar-settings" onClick={() => setPageNo(5)}>
          <i className="fa-solid fa-gear fa-xl"></i>
          <p className="nav-bar-text">settings</p>
        </span>
      </nav>
      <div className="main-content">
        <ActivePage />
      </div>
    </div>
  );
}

export default App;
