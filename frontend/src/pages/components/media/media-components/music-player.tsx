import { useRef, useState } from "react";
import "./music-player.css";

function MusicPlayer() {
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
        src="http://localhost:3000/api/media/0c79456ccc4d447ec88236fce8e38a4d/stream"
      ></audio>

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
    </div>
  );
}

export default MusicPlayer;
