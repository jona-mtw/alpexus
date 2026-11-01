import "./movie-details.css";

type Movie = {
  Id: string;
  Name: string;
  PremierDate: string;
  Overview: string;
  Genres: string;
  CommunityRating: string;
};

type MovieProps = {
  movie: Movie;
  onReturn: () => void;
};

function MovieDetails({ movie, onReturn }: MovieProps) {
  return (
    <div className="movie-details">
      <div className="movie-details-header">
        <div className="movie-details-header-left-wrapper">
          <h1>{movie.Name}</h1>
        </div>
        <i className="fa-solid fa-xmark return-album" onClick={onReturn}></i>
      </div>

      <div className="movie-details-body">
        <img
          className="movie-cover"
          src={`http://localhost:3000/api/media/${movie.Id}/cover`}
          alt=""
          onError={(e) => {
            const img = e.currentTarget;
            img.src = `http://localhost:5173/alpexus/placeholder.png`;
          }}
        />
        <div className="movie-description">
          <p>{movie.Overview}</p>
          <i className="fa-solid fa-play"></i>
        </div>
      </div>
      <video controls src={`http://localhost:3000/api/media/${movie.Id}/stream?type=video`}></video>
    </div>
  );
}

export default MovieDetails;
