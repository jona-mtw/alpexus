import { useState } from "react";
import "./media.css";
import Music from "./components/media/music.tsx";
import Movies from "./components/media/movies.tsx";
import TVShows from "./components/media/tv-shows.tsx";

function Media() {
  const pages: React.ComponentType[] = [Movies, TVShows, Music];
  const [pageNo, setPageNo] = useState(0);
  const Page = pages[pageNo];

  function pageClicked(pageNo: number) {
    setPageNo(pageNo);
  }

  function fetchSongs() {
    return fetch("http://localhost:3000/api/media/songs");
  }

  return (
    <>
      <div className="media">
        <nav className="media-top-row">
          <h2
            className={pageNo === 0 ? "active media-nav" : "media-nav"}
            onClick={() => pageClicked(0)}
          >
            Movies
          </h2>
          <h2
            className={pageNo === 1 ? "active media-nav" : "media-nav"}
            onClick={() => pageClicked(1)}
          >
            TV Shows
          </h2>
          <h2
            className={pageNo === 2 ? "active media-nav" : "media-nav"}
            onClick={() => pageClicked(2)}
          >
            Music
          </h2>
        </nav>
        <div className="media-section">
          <Page />
        </div>
      </div>
    </>
  );
}

export default Media;
