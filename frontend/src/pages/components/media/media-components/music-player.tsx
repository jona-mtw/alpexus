import { useRef, useState } from "react";
import "./music-player.css";

type Song = {
  Id: string;
  Name: string;
  Artists: string[];
};

type MusicPlayerProps = {
  song: Song;
};

function MusicPlayer({ song }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function togglePause() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio.play();
      console.log("playing");
    } else {
      audio.pause();
    }
    setIsPlaying(!isPlaying);
    console.log("paused");
  }

  console.log(audioRef.current?.currentSrc);
  console.log(audioRef.current?.error);

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        onError={(event) => {
          const audio = event.currentTarget;

          console.log("Audio URL:", audio.currentSrc);
          console.log("Audio error:", audio.error);
          console.log("Network state:", audio.networkState);
          console.log("Ready state:", audio.readyState);
        }}
        src={`http://localhost:3000/api/media/${song.Id}/stream`}
      ></audio>
      <div className="music-details-wrapper">
        <div className="cover-art">
          <img
            src={`http://localhost:3000/api/media/${song.Id}/cover`}
            alt="hello"
            className="album-cover"
            onError={(e) => {
              const img = e.currentTarget;
              img.src = "http://localhost:5173/alpexus/placeholder.png";
            }}
          />
        </div>
        <div className="music-details">
          <h2 className="song-name">{song.Name}</h2>
          <p className="song-artist">{song.Artists.join(", ") || "Unknown Artist"}</p>
        </div>
      </div>
      <div className="music-controls">
        <div className="controls">
          <i className="fa-solid fa-backward"></i>
          <i
            onClick={togglePause}
            className={isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"}
          ></i>
          <i className="fa-solid fa-forward"></i>
        </div>
        <input type="range" className="slider"></input>
      </div>
      <div className="placeholder-wrapper"></div>
    </div>
  );
}

export default MusicPlayer;
