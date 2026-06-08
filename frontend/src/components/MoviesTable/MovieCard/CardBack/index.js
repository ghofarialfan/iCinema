import React from "react";
import "./style.css";

const CardBack = ({
  title,
  rate,
  genre,
  description,
  trailerLink,
  movieLength,
}) => {
  const genres = Array.isArray(genre)
    ? genre.map((g) => g.name).filter(Boolean).join(", ")
    : "Uncategorized";

  const handleTrailerClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="movie-card-back">
      <div className="movie-card-back-header">
        <span className="movie-card-back-icon">
          <i className="fas fa-ticket-alt"></i>
        </span>

        <div>
          <h5>{title || "Movie Details"}</h5>
          <p>Interactive movie overview</p>
        </div>
      </div>

      <div className="movie-card-back-stats">
        <span>
          <i className="fas fa-star"></i>
          {rate || "N/A"}
        </span>

        <span>
          <i className="fas fa-clock"></i>
          {movieLength || "Unknown"}
        </span>
      </div>

      <div className="movie-card-back-genre">
        <i className="fas fa-tags"></i>
        <span>{genres}</span>
      </div>

      <div className="movie-card-back-body">
        <p>
          {description ||
            "No description available for this movie. Please update the movie details to improve the viewing experience."}
        </p>
      </div>

      <div className="movie-card-back-actions">
        <a
          href={trailerLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={
            trailerLink
              ? "movie-card-back-trailer"
              : "movie-card-back-trailer disabled"
          }
          onClick={handleTrailerClick}
        >
          <i className="fas fa-play"></i>
          Trailer
        </a>

        <span className="movie-card-back-hint">
          <i className="fas fa-sync-alt"></i>
          Flip Back
        </span>
      </div>
    </div>
  );
};

export default CardBack;