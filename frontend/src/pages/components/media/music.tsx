import "./music.css";
import MusicTrack from "./media-components/music-track";
import MusicPlayer from "./media-components/music-player";
import AlbumViewer from "./media-components/album-viewer";
import { useState, useEffect } from "react";

type Song = {
  Id: string;
  Name: string;
  Artists: string[];
  AlbumId?: string;
};

type Album = {
  Id: string;
  Name: string;
  Artists: string[];
};

function Music() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [songIndex, setSongIndex] = useState(0);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [page, setPage] = useState(-1);

  useEffect(() => {
    async function fetchMusicInfo() {
      const [songResponse, albumsResponse] = await Promise.all([
        fetch("http://localhost:3000/api/media/songs"),
        fetch("http://localhost:3000/api/media/albums"),
      ]);
      const songsData = await songResponse.json();
      const albumsData = await albumsResponse.json();
      setSongs(songsData);
      setAlbums(albumsData);
    }
    fetchMusicInfo();
  }, []);

  const song = songs[songIndex];

  return (
    <div className="music">
      <div className="music-info">
        {page === -1 ? (
          <>
            <h1>Music</h1>
            {albums.length > 0 ? (
              <>
                <h2>Albums</h2>
                <div className="albums">
                  {albums.map((album, index) => (
                    <AlbumViewer album={album} onClick={() => setPage(index)} />
                  ))}
                </div>
              </>
            ) : null}
            <h2>Tracks</h2>
            <div className="tracks">
              {songs.map((song, index) => (
                <MusicTrack key={song.Id} song={song} onClick={() => setSongIndex(index)} />
              ))}
            </div>
          </>
        ) : (
          (() => {
            const album = albums[page];
            return (
              <>
                <div className="album-header">
                  <div className="album-title">
                    <i className="fa-solid fa-xmark return-album" onClick={() => setPage(-1)}></i>
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
                      <MusicTrack
                        song={song}
                        onClick={() => {
                          songs.map((allsong, index) => {
                            allsong.Id === song.Id ? setSongIndex(index) : null;
                          });
                        }}
                      />
                    ))}
                </div>
              </>
            );
          })()
        )}
      </div>
      <MusicPlayer
        song={song}
        onNext={() => setSongIndex((current) => (current + 1) % songs.length)}
        onPrevious={() => setSongIndex((current) => (current - 1 + songs.length) % songs.length)}
      />
    </div>
  );
}

export default Music;
