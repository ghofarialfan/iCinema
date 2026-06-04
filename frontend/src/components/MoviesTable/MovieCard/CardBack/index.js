import React from "react";
import "./style.css";

const CardBack = ({ description }) => {
  return (
    <div className="movie-card-back">
      <div className="movie-card-back-header">
        <span className="movie-card-back-icon">
          <i className="fas fa-align-left"></i>
        </span>

        <div>
          <h5>Summary</h5>
          <p>Movie overview</p>
        </div>
      </div>

      <div className="movie-card-back-body">
        <p>
          {description ||
            "No description available for this movie. Please update the movie details to improve the viewing experience."}
        </p>
      </div>

      <div className="movie-card-back-hint">
        <i className="fas fa-sync-alt"></i>
        Click card to return
      </div>
    </div>
  );
};

export default CardBack;