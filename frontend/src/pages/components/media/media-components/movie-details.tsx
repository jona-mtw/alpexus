import { useState } from "react";
import "./movie-details.css";
import VideoPlayer from "./video-streaming";

type Movie = {
  Id: string;
  Name: string;
  PremiereDate: string;
  Overview: string;
  Genres: string[];
  CommunityRating: string;
  RunTimeTicks: number;
};

type MovieProps = {
  movie: Movie;
  onReturn: () => void;
};

function MovieDetails({ movie, onReturn }: MovieProps) {
  const [showPlayer, setShowPlayer] = useState(false);
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

  return (
    <div className="movie-details">
      <div className="movie-details-left-wrapper">
        <div className="play-video" onClick={() => setShowPlayer(true)}>
          <img
            className="movie-cover"
            src={`http://localhost:3000/api/media/${movie.Id}/cover`}
            alt=""
            onError={(e) => {
              const img = e.currentTarget;
              img.src = `http://localhost:5173/alpexus/placeholder.png`;
            }}
          />
          <i className="fa-solid fa-play"></i>
          <p>PLAY</p>
        </div>
      </div>
      <div className="movie-details-right-wrapper">
        <div className="movie-details-header">
          <h1>{movie.Name}</h1>
          <i className="fa-solid fa-xmark return-movie" onClick={onReturn}></i>
        </div>
        <div className="movie-info">
          <p>{String(new Date(movie.PremiereDate).getFullYear())}</p>
          <p>
            <i className="fa-solid fa-star"></i>
            {Math.round(Number(movie.CommunityRating) * 10) / 10}
          </p>
          <p>{formatRuntimeTicks(movie.RunTimeTicks)}</p>
          <div className="movie-genres">
            {movie.Genres.map((genre) => {
              return <p className="movie-genre">{genre}</p>;
            })}
          </div>
        </div>
        <p>{movie.Overview}</p>
      </div>
      {showPlayer && <VideoPlayer />}
    </div>
  );
}

export default MovieDetails;
