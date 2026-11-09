import { useEffect, useState } from "react";
import "./movies.css";
import MovieDetails from "./media-components/movie-details";

type Movie = {
  Id: string;
  Name: string;
  PremiereDate: string;
  Overview: string;
  Genres: string[];
  CommunityRating: number;
  RunTimeTicks: number;
};

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState("0");
  const [chosenMovie, setChosenMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function fetchMovieInfo() {
      const movieResponse = await fetch("/api/media/movies");
      const moviesData = await movieResponse.json();
      setMovies(moviesData);
    }
    fetchMovieInfo();
  }, []);

  return page == "0" ? (
    <div className="movies">
      <h1>Movies</h1>
      <div className="movie-list">
        {movies.map((movie) => {
          return (
            <div
              className="movie"
              onClick={() => {
                setChosenMovie(movie);
                setPage(movie.Id);
              }}
            >
              <img
                className="movie-cover"
                src={`/api/media/${movie.Id}/cover`}
                alt=""
                onError={(e) => {
                  const img = e.currentTarget;
                  img.src = `http://localhost:5173/alpexus/placeholder.png`;
                }}
              />
              <h2 className="movie-name">{movie.Name}</h2>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    chosenMovie && <MovieDetails movie={chosenMovie} onReturn={() => setPage("0")} />
  );
}
export default Movies;
