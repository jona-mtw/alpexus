import { useState } from "react";
import "./music-track.css";

type Song = {
  Id: string;
  Name: string;
  Artists: string[];
  AlbumId?: string;
};

type MusicTrackProps = {
  song: Song;
  onClick: () => void;
};

function MusicTrack({ song, onClick }: MusicTrackProps) {
  const [hasImage, setHasImage] = useState(true);
  return (
    <div className="music-track" onClick={onClick}>
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
      <div className="song-wrapper">
        <h2 className="song-name">{song.Name}</h2>
        <p className="song-artist">{song.Artists || "Unknown Artist"}</p>
      </div>
    </div>
  );
}
export default MusicTrack;
