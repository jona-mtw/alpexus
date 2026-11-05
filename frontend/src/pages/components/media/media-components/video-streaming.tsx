import "./video-streaming.css";
import EpisodeViewer from "./episode-details";
import { useState, useEffect } from "react";

type Movie = {
  Id: string;
  Name: string;
  PremiereDate: string;
  Overview: string;
  Genres: string[];
  CommunityRating: number;
  RunTimeTicks: number;
};

type Episode = {
  Id: string;
  Name: string;
  PremiereDate: string;
  Overview: string;
  Genres: string[];
  CommunityRating: number;
  RunTimeTicks: number;
  SeriesName: string;
  IndexNumber: number;
  ParentIndexNumber: number;
};

type VideoPlayerProps = {
  movie: Movie | Episode;
  onReturn: () => void;
  isTvShow?: boolean;
};

function VideoPlayer({ movie, onReturn, isTvShow = false }: VideoPlayerProps) {
  const [episodeData, setEpisodeData] = useState<Episode[]>([]);
  const [selectedEpsiode, setSelectedEpisode] = useState<Movie | Episode>(movie);

  function formatRuntimeTicks(ticks: number) {
    ticks /= 10_000_000;
    let time = "";
    if (ticks <= 90) {
      time = `${Math.round(ticks)}s`;
    } else if (ticks <= 5400) {
      time = `${Math.round(ticks / 60)}m`;
    } else {
      ticks /= 60;
      time = ticks + "s";
      if (Math.round(ticks % 60) == 0) {
        time = `${Math.round(ticks / 60)}h`;
      } else {
        time = `${Math.floor(ticks / 60)}h ${Math.round(ticks % 60)}m`;
      }
    }
    return time;
  }

  useEffect(() => {
    if (!isTvShow) return;
    async function fetchEpisodeInfo() {
      const episodeResponse = await fetch("http://localhost:3000/api/media/episodes");
      const episodeData = await episodeResponse.json();
      setEpisodeData(episodeData);
    }
    fetchEpisodeInfo();
  }, [isTvShow]);

  return (
    <div className="video-streaming">
      <div className="video-streaming-header">
        <h1>
          {isTvShow && "SeriesName" in selectedEpsiode
            ? selectedEpsiode.SeriesName
            : selectedEpsiode.Name}
        </h1>
        <i className="fa-solid fa-xmark return-movie" onClick={onReturn}></i>
      </div>
      <div className="video-streaming-body">
        <video
          className="streamed-video"
          controls
          src={`http://localhost:3000/api/media/${selectedEpsiode.Id}/stream?type=video`}
        ></video>
        <div className="video-controls">
          <h2>{selectedEpsiode.Name}</h2>
          <div className="video-controls-wrapper">
            <p>{formatRuntimeTicks(selectedEpsiode.RunTimeTicks)}</p>
            <p>
              <i className="fa-solid fa-star"></i>
              {Math.round(Number(movie.CommunityRating) * 10) / 10}
            </p>
          </div>

          <img
            className="movie-cover"
            src={`http://localhost:3000/api/media/${selectedEpsiode.Id}/cover`}
            alt=""
            onError={(e) => {
              const img = e.currentTarget;
              img.src = `http://localhost:5173/alpexus/placeholder.png`;
            }}
          />
          <p>{selectedEpsiode.Overview}</p>
        </div>
      </div>
      {isTvShow ? (
        <>
          {" "}
          <h1>Episodes</h1>
          <div className="episodes-list">
            {episodeData.map((episode) => {
              if ("SeriesName" in movie && episode.SeriesName == movie.SeriesName) {
                return (
                  <EpisodeViewer
                    key={episode.Id}
                    episode={episode}
                    onClick={() => {
                      setSelectedEpisode(episode);
                    }}
                  />
                );
              }
            })}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default VideoPlayer;
