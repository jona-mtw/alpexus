import "./episode-details.css";

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

type EpisodeViewerProps = {
  episode: Episode;
  onClick: () => void;
};

function EpisodeViewer({ episode, onClick }: EpisodeViewerProps) {
  return (
    <div className="episode" onClick={onClick}>
      <img
        className="episode-cover"
        src={`/api/media/${episode.Id}/cover`}
        alt=""
        onError={(e) => {
          const img = e.currentTarget;
          img.src = `http://localhost:5173/alpexus/placeholder.png`;
        }}
      />
      <div className="episode-details">
        <div className="episode-details-header">
          <h1>{episode.Name}</h1>
          <h3>{`S${episode.ParentIndexNumber} E${episode.IndexNumber}`}</h3>
        </div>
        <p>{episode.Overview}</p>
      </div>
    </div>
  );
}

export default EpisodeViewer;
