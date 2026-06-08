import React from "react";
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
  const genres = Array.isArray(genre)
    ? genre.map((g) => g.name).filter(Boolean).join(", ")
    : "Uncategorized";

  const poster = coverImage || noPoster;

  const stopPropagation = (event) => {
    event.stopPropagation();
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
          <i className="fas fa-times"></i>
        </button>

        <div className="movie-detail-poster">
          <img src={poster} alt={title || "Movie poster"} />

          <div className="movie-detail-poster-overlay"></div>

          <span className="movie-detail-rating">
            <i className="fas fa-star"></i>
            {rate || "N/A"}
          </span>
        </div>

        <div className="movie-detail-content">
          <span className="movie-detail-badge">Movie Details</span>

          <h2>{title || "Untitled Movie"}</h2>

          <div className="movie-detail-meta">
            <span>
              <i className="fas fa-clock"></i>
              {movieLength || "Unknown duration"}
            </span>

            <span>
              <i className="fas fa-tags"></i>
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
            <div className="movie-detail-video">
              <h4>Preview Video</h4>
              <video controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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
              <i className="fas fa-play"></i>
              Watch Trailer
            </a>

            <button type="button" onClick={onClose} className="movie-detail-back">
              <i className="fas fa-arrow-left"></i>
              Back to Movies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPanel;
