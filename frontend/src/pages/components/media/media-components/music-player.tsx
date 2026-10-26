import { useEffect, useRef, useState } from "react";
import "./music-player.css";

type Song = {
  Id: string;
  Name: string;
  Artists: string[];
};

type MusicPlayerProps = {
  song: Song;
  onNext: () => void;
  onPrevious: () => void;
};

function MusicPlayer({ song, onNext, onPrevious }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    audio.load();
  }, [song.Id]);

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
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
          <h4 className="song-name">{song.Name}</h4>
          <p className="song-artist">{song.Artists.join(", ") || "Unknown Artist"}</p>
        </div>
      </div>
      <div className="music-controls">
        <div className="controls">
          <i className="fa-solid fa-backward" onClick={onPrevious}></i>
          <i
            onClick={togglePause}
            className={isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"}
          ></i>
          <i className="fa-solid fa-forward" onClick={onNext}></i>
        </div>
        <input
          type="range"
          className="slider"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(event) => {
            const time = Number(event.target.value);

            if (audioRef.current) {
              audioRef.current.currentTime = time;
            }
            setCurrentTime(time);
          }}
        ></input>
      </div>
      <div className="placeholder-wrapper"></div>
    </div>
  );
}

export default MusicPlayer;
