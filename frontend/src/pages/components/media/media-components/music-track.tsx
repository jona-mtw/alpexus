import "./music-track.css";

type Song = {
  Id: string;
  Name: string;
  Artists: string[];
};

type MusicTrackProps = {
  song: Song;
  onClick: () => void;
};

function MusicTrack({ song, onClick }: MusicTrackProps) {
  return (
    <div className="music-track" onClick={onClick}>
      <img
        src={`http://localhost:3000/api/media/${song.Id}/cover`}
        alt="hello"
        className="album-cover"
        onError={(e) => {
          const img = e.currentTarget;
          img.src = "http://localhost:5173/alpexus/placeholder.png";
        }}
      />
      <div className="song-wrapper">
        <h2 className="song-name">{song.Name}</h2>
        <p className="song-artist">{song.Artists || "Unknown Artist"}</p>
      </div>
    </div>
  );
}
export default MusicTrack;
