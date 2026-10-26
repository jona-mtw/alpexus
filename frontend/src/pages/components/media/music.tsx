import "./music.css";
import MusicPlayer from "./media-components/music-player";
import { useState, useEffect } from "react";

type Song = {
  Id: string;
  Name: string;
  Artists: string[];
};

function Music() {
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    async function fetchMusicInfo() {
      const response = await fetch("http://localhost:3000/api/media/songs");
      const data = await response.json();
      console.log(data[1]);
      setSong(data[1]);
    }
    fetchMusicInfo();
  }, []);

  return (
    <div className="music">
      <div className="music-info">
        <h1>Music</h1>
      </div>
      {song && <MusicPlayer song={song} />}
    </div>
  );
}

export default Music;
