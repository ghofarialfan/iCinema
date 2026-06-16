import React, { useState } from "react";
import "./style.css";
import noPoster from "../../../../images/noposter.jpg";

const MovieDetailPanel = ({
  title,
  rate,
  genre,
  coverImage,
  description,
  trailerLink,
  videoUrl,
  movieLength,
  onClose,
}) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const genres = Array.isArray(genre)
    ? genre.map((g) => g.name).filter(Boolean).join(", ")
    : "Uncategorized";

  const poster = coverImage || noPoster;

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const openPlayer = (event) => {
    event.stopPropagation();
    setIsPlayerOpen(true);
  };

  const closePlayer = (event) => {
    event.stopPropagation();
    setIsPlayerOpen(false);
  };

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail-panel" onClick={stopPropagation}>
        <button
          type="button"
          className="movie-detail-close"
          onClick={onClose}
          aria-label="Close movie details"
        >
          ×
        </button>

        <div className="movie-detail-poster">
          <img src={poster} alt={title || "Movie poster"} />
          <div className="movie-detail-poster-overlay"></div>

          <span className="movie-detail-rating">
            <span className="movie-inline-emoji" aria-hidden="true">
              ★
            </span>
            {rate || "N/A"}
          </span>
        </div>

        <div className="movie-detail-content">
          <span className="movie-detail-badge">Movie Details</span>

          <h2>{title || "Untitled Movie"}</h2>

          <div className="movie-detail-meta">
            <span>
              <span className="movie-inline-emoji" aria-hidden="true">
                ⏱
              </span>
              {movieLength || "Unknown duration"}
            </span>

            <span>
              <span className="movie-inline-emoji" aria-hidden="true">
                🏷
              </span>
              {genres}
            </span>
          </div>

          <div className="movie-detail-summary">
            <h4>Summary</h4>
            <p>
              {description ||
                "No description available for this movie. Please update the movie details to improve the viewing experience."}
            </p>
          </div>

          {videoUrl && (
            <div className="movie-detail-watch-card">
              <div className="movie-watch-thumbnail">
                <img src={poster} alt={title || "Movie preview"} />
                <div className="movie-watch-overlay"></div>

                <button
                  type="button"
                  className="movie-watch-play-button"
                  onClick={openPlayer}
                >
                  <span className="movie-button-emoji" aria-hidden="true">
                    ▶
                  </span>
                  Play Movie
                </button>
              </div>

              <div className="movie-watch-info">
                <span>Available Preview</span>
                <h4>Ready to Watch</h4>
                <p>
                  Click the play button to open a focused full-screen movie
                  player experience.
                </p>
              </div>
            </div>
          )}

          <div className="movie-detail-actions">
            <a
              href={trailerLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={
                trailerLink
                  ? "movie-detail-trailer"
                  : "movie-detail-trailer disabled"
              }
            >
              <span className="movie-button-emoji" aria-hidden="true">
                ▶
              </span>
              Watch Trailer
            </a>

            <button type="button" onClick={onClose} className="movie-detail-back">
              <span className="movie-button-emoji" aria-hidden="true">
                ←
              </span>
              Back to Movies
            </button>
          </div>
        </div>
      </div>

      {isPlayerOpen && (
        <div className="movie-fullscreen-player" onClick={closePlayer}>
          <div className="movie-player-container" onClick={stopPropagation}>
            <button
              type="button"
              className="movie-player-close"
              onClick={closePlayer}
              aria-label="Close movie player"
            >
              ×
            </button>

            <div className="movie-player-header">
              <span>Now Playing</span>
              <h3>{title || "Untitled Movie"}</h3>
            </div>

            <video controls autoPlay className="movie-player-video">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPanel;