import { useState } from "react";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <nav className={sidebarOpen ? "sidebar open" : "sidebar closed"}>
        <span id="nav-bar-title" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className="fa-solid fa-cloud fa-xl"></i>
          <h1>ALPEXUS</h1>
        </span>
        <ul id="nav-bar-links">
          <li className="nav-bar-link">
            <a href="">
              <i className="fa-solid fa-house fa-xl"></i>
              <p className="nav-bar-text">home</p>
            </a>
          </li>
          <li className="nav-bar-link">
            <a href="">
              <i className="fa-solid fa-folder-open fa-xl"></i>
              <p className="nav-bar-text">files</p>
            </a>
          </li>
          <li className="nav-bar-link">
            <a href="">
              <i className="fa-solid fa-lock fa-xl"></i>
              <p className="nav-bar-text">passwords</p>
            </a>
          </li>
          <li className="nav-bar-link">
            <a href="">
              <i className="fa-solid fa-note-sticky fa-xl"></i>
              <p className="nav-bar-text">notes</p>
            </a>
          </li>
          <li className="nav-bar-link">
            <a href="">
              <i className="fa-solid fa-image fa-xl"></i>
              <p className="nav-bar-text">media</p>
            </a>
          </li>
        </ul>
        <a href="" className="nav-bar-link" id="nav-bar-settings">
          <i className="fa-solid fa-gear fa-xl"></i>
          <p className="nav-bar-text">settings</p>
        </a>
      </nav>
    </>
  );
}

export default App;
