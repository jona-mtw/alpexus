import "./album-viewer.css";

type Album = {
  Id: string;
  Name: string;
  Artists: string[];
};

type AlbumProps = {
  album: Album;
  onClick: () => void;
};

function AlbumViewer({ album, onClick }: AlbumProps) {
  return (
    <div className="album" onClick={onClick}>
      <img
        src={`http://localhost:3000/api/media/${album.Id}/cover`}
        alt=""
        id="album-cover"
        onError={(e) => {
          const img = e.currentTarget;
          img.src = `http://localhost:5173/alpexus/placeholder.png`;
        }}
      />
      <h4>{album.Name}</h4>
      <p>{album.Artists[0]}</p>
    </div>
  );
}

export default AlbumViewer;
