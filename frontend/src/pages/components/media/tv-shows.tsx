import "./tv-shows.css";
import { useEffect, useState } from "react";
import MovieDetails from "./media-components/movie-details";

type TvShow = {
  Id: string;
  Name: string;
  PremiereDate: string;
  Overview: string;
  Genres: string[];
  CommunityRating: number;
  RunTimeTicks: number;
};

function TVShow() {
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [page, setPage] = useState("0");
  const [chosenShow, setChosenShow] = useState<TvShow | null>(null);

  useEffect(() => {
    async function fetchTvShowInfo() {
      const tvShowResponse = await fetch("http://localhost:3000/api/media/tv-shows");
      const tvShowsData = await tvShowResponse.json();
      setTvShows(tvShowsData);
    }
    fetchTvShowInfo();
  }, []);

  return page == "0" ? (
    <div className="tv-shows">
      <h1>TV Shows</h1>
      <div className="tv-shows-list">
        {tvShows.map((tvShow) => {
          return (
            <div
              key={tvShow.Id}
              className="tv-show"
              onClick={() => {
                setPage(tvShow.Id);
                setChosenShow(tvShow);
              }}
            >
              <img
                className="movie-cover"
                src={`http://localhost:3000/api/media/${tvShow.Id}/cover`}
                alt=""
                onError={(e) => {
                  const img = e.currentTarget;
                  img.src = `http://localhost:5173/alpexus/placeholder.png`;
                }}
              />
              <h2 className="tv-show-name">{tvShow.Name}</h2>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    chosenShow && <MovieDetails movie={chosenShow} onReturn={() => setPage("0")} isTvShow={true} />
  );
}

export default TVShow;
