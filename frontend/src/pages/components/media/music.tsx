import "./music.css";
import MusicPlayer from "./media-components/music-player";

function Music() {
  return (
    <div className="music">
      <div className="music-info">
        <h1>Music</h1>
      </div>
      <MusicPlayer />
    </div>
  );
}

export default Music;
