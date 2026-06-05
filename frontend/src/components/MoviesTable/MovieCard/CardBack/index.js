import React from "react";
import "./style.css";

const CardBack = ({ description, videoUrl }) => {
  const handleVideoClick = (event) => {
    event.stopPropagation();
  };

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
        {videoUrl ? (
          <div className="movie-video-container" onClick={handleVideoClick}>
            <video controls className="movie-video-player">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : null}

        <p className={videoUrl ? "description-with-video" : ""}>
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