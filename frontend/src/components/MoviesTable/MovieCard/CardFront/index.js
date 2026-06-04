import React from "react";
import "./style.css";
import noPoster from "../../../../images/noposter.jpg";

const CardFront = ({
  coverImage,
  rate,
  title,
  genre,
  trailerLink,
  movieLength,
}) => {
  const genres = Array.isArray(genre)
    ? genre.map((g) => g.name).filter(Boolean).join(", ")
    : "Uncategorized";

  const rating = rate || "N/A";
  const duration = movieLength || "Unknown length";
  const poster = coverImage || noPoster;

  const handleTrailerClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="movie-card-front">
      <div className="movie-poster-wrapper">
        <img
          src={poster}
          alt={title || "Movie poster"}
          className="movie-poster"
        />

        <div className="movie-poster-overlay"></div>

        <span className="movie-rating-badge">
          <i className="fas fa-star"></i>
          {rating}
        </span>
      </div>

      <div className="movie-card-content">
        <div className="movie-card-meta">
          <span>
            <i className="fas fa-clock"></i>
            {duration}
          </span>
        </div>

        <h4>{title || "Untitled Movie"}</h4>

        <p>{genres}</p>

        <a
          href={trailerLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={
            trailerLink
              ? "movie-trailer-button"
              : "movie-trailer-button disabled"
          }
          onClick={handleTrailerClick}
        >
          <i className="fas fa-play"></i>
          Watch Trailer
        </a>
      </div>
    </div>
  );
};

export default CardFront;