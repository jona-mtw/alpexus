import "./album.css";

type Album = {
  Id: string;
  Name: string;
  Artists: string[];
};

type AlbumProps = {
  album: Album;
};

function AlbumViewer({ album }: AlbumProps) {
  return (
    <div className="album">
      <h4>{album.Name}</h4>
      <p>{album.Artists[0]}</p>
    </div>
  );
}

export default AlbumViewer;
