import "./album.css";
import MusicTrack from "./music-track";

type AlbumType = {
  Id: string;
  Name: string;
  Artists: string[];
};

type Song = {
  Id: string;
  Name: string;
  Artists: string[];
  AlbumId?: string;
};

type AlbumViewerProps = {
  album: AlbumType;
  onClick: () => void;
};

function AlbumViewer({ album, onClick }: AlbumViewerProps) {
  return (
    <button type="button" className="album" onClick={onClick}>
      <h4>{album.Name}</h4>
      <p>{album.Artists[0]}</p>
    </button>
  );
}

type AlbumDetailProps = {
  album: AlbumType;
  songs: Song[];
  onReturn: () => void;
  onSongClick: (songId: string) => void;
};

export function AlbumDetail({ album, songs, onReturn, onSongClick }: AlbumDetailProps) {
  return (
    <>
      <div className="album-header">
        <div className="album-title">
          <button
            type="button"
            className="return-album"
            onClick={onReturn}
            aria-label="Return to albums"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2>{album.Name}</h2>
          <h4>{album.Artists[0]}</h4>
        </div>
        <img
          src={`http://localhost:3000/api/media/${album.Id}/cover`}
          alt=""
          id="album-cover-header"
          onError={(event) => {
            event.currentTarget.src = "http://localhost:5173/alpexus/placeholder.png";
          }}
        />
      </div>
      <div className="tracks">
        {songs
          .filter((song) => song.AlbumId === album.Id)
          .map((song) => (
            <MusicTrack key={song.Id} song={song} onClick={() => onSongClick(song.Id)} />
          ))}
      </div>
    </>
  );
}

export default AlbumViewer;
