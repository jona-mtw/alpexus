import "./music.css";
import MusicTrack from "./media-components/music-track";
import MusicPlayer from "./media-components/music-player";
import AlbumViewer from "./media-components/album";
import { AlbumDetail } from "./media-components/album";
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
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

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
        <h1>Music</h1>
        {selectedAlbum ? (
          <AlbumDetail
            album={selectedAlbum}
            songs={songs}
            onReturn={() => setSelectedAlbum(null)}
            onSongClick={(songId) => {
              const index = songs.findIndex((track) => track.Id === songId);
              if (index !== -1) setSongIndex(index);
            }}
          />
        ) : (
          <>
            {albums.length > 0 && (
              <>
                <h2>Albums</h2>
                <div className="albums">
                  {albums.map((album) => (
                    <AlbumViewer
                      key={album.Id}
                      album={album}
                      onClick={() => setSelectedAlbum(album)}
                    />
                  ))}
                </div>
              </>
            )}
            <h2>Tracks</h2>
            <div className="tracks">
              {songs.map((song, index) => (
                <MusicTrack key={song.Id} song={song} onClick={() => setSongIndex(index)} />
              ))}
            </div>
          </>
        )}
      </div>
      {song && (
        <MusicPlayer
          song={song}
          onNext={() => setSongIndex((current) => (current + 1) % songs.length)}
          onPrevious={() => setSongIndex((current) => (current - 1 + songs.length) % songs.length)}
        />
      )}
    </div>
  );
}

export default Music;
