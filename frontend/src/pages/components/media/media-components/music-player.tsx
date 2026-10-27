import { useEffect, useRef, useState } from "react";
import "./music-player.css";

type Song = {
  Id: string;
  Name: string;
  Artists: string[];
  AlbumId?: string;
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
  const [hasImage, setHasImage] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const isSeekingRef = useRef(false);

  function togglePause() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((error) => {
        console.error("Failed to play audio", error);
      });
    } else {
      audio.pause();
    }
    console.log("paused");
  }

  console.log(audioRef.current?.currentSrc);
  console.log(audioRef.current?.error);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    isSeekingRef.current = false;
  }, [song.Id]);

  useEffect(() => {
    function stopSeeking() {
      isSeekingRef.current = false;
      setIsSeeking(false);
    }

    window.addEventListener("pointerup", stopSeeking);
    window.addEventListener("pointercancel", stopSeeking);

    return () => {
      window.removeEventListener("pointerup", stopSeeking);
      window.removeEventListener("pointercancel", stopSeeking);
    };
  });

  return (
    <div className="music-player">
      <audio
        key={song.Id}
        ref={audioRef}
        autoPlay
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onNext();
        }}
        onError={(event) => {
          const audio = event.currentTarget;

          console.log("Audio URL:", audio.currentSrc);
          console.log("Audio error:", audio.error);
          console.log("Network state:", audio.networkState);
          console.log("Ready state:", audio.readyState);
        }}
        onTimeUpdate={(event) => {
          if (!isSeekingRef.current) {
            setCurrentTime(event.currentTarget.currentTime);
          }
        }}
        src={`http://localhost:3000/api/media/${song.Id}/stream`}
      ></audio>
      <div className="music-details-wrapper">
        <div className="cover-art">
          {hasImage ? (
            <img
              className="album-cover"
              src={`http://localhost:3000/api/media/${song.Id}/cover`}
              alt={song.Name}
              onLoad={() => setHasImage(true)}
              onError={() => setHasImage(false)}
            />
          ) : (
            <img
              className="album-cover"
              src={`http://localhost:3000/api/media/${song.AlbumId}/cover`}
              onError={(e) => {
                const img = e.currentTarget;
                img.src = "http://localhost:5173/alpexus/placeholder.png";
              }}
            />
          )}
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
          step={0.1}
          value={currentTime}
          onPointerDown={() => {
            isSeekingRef.current = true;
            setIsSeeking(true);
          }}
          onChange={(event) => {
            const time = Number(event.target.value);
            setCurrentTime(time);
            if (audioRef.current) {
              audioRef.current.currentTime = time;
            }
          }}
          onPointerUp={() => {
            isSeekingRef.current = false;
            setIsSeeking(false);
          }}
        ></input>
      </div>
      <div className="placeholder-wrapper"></div>
    </div>
  );
}

export default MusicPlayer;
