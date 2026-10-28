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

type AlbumProps = {
  album: AlbumType;
  songs: Song[];
  onReturn: () => void;
  onClick: () => void;
};

function Album({ album, songs, onReturn, onClick }: AlbumProps) {
  return (
    <>
      <div className="album-header">
        <div className="album-title">
          <i className="fa-solid fa-xmark return-album" onClick={onReturn}></i>
          <h2>{album.Name}</h2>
          <h4>{album.Artists[0]}</h4>
        </div>
        <img
          src={`http://localhost:3000/api/media/${album.Id}/cover`}
          alt=""
          id="album-cover-header"
          onError={(e) => {
            const img = e.currentTarget;
            img.src = `http://localhost:5173/alpexus/placeholder.png`;
          }}
        />
      </div>
      <div className="tracks">
        {songs
          .filter((song) => song.AlbumId === album.Id)
          .map((song) => (
            <MusicTrack song={song} onClick={onClick} />
          ))}
      </div>
    </>
  );
}

export default Album;
