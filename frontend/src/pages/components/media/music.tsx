import "./music.css";
import MusicTrack from "./media-components/music-track";
import MusicPlayer from "./media-components/music-player";
import { useState, useEffect } from "react";

type Song = {
  Id: string;
  Name: string;
  Artists: string[];
};

function Music() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songIndex, setSongIndex] = useState(0);

  useEffect(() => {
    async function fetchMusicInfo() {
      const response = await fetch("http://localhost:3000/api/media/songs");
      const data = await response.json();
      setSongs(data);
    }
    fetchMusicInfo();
  }, []);

  const song = songs[songIndex];
  const albums = async () => (await fetch("http://localhost:3000/api/media/albums")).json;

  return (
    <div className="music">
      <div className="music-info">
        <h1>Music</h1>
        {albums.length > 0 ? (
          <>
            <h2>Albums</h2>
            <div className="albums"></div>
          </>
        ) : null}
        <h2>Tracks</h2>
        <div className="tracks">
          {songs.map((song, index) => (
            <MusicTrack key={song.Id} song={song} onClick={() => setSongIndex(index)} />
          ))}
        </div>
      </div>
      {song && (
        <MusicPlayer
          song={song}
          onNext={() => setSongIndex((current) => (current + 1) % songs.length)}
          onPrevious={() => setSongIndex((current) => (current - 1 + songs.length) % songs.length)}
        />
      )}
    </div>
  );
}

export default Music;
