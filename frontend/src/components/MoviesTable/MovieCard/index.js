import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import FlippingCardFront from "./CardFront";
import MovieDetailPanel from "./CardBack";
import "./style.css";

export default function MovieCard({ movie }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    title,
    rate,
    genre,
    image,
    description,
    trailerLink,
    videoUrl,
    movieLength,
  } = movie;

  const openDetail = () => {
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
  };

  useEffect(() => {
    if (isDetailOpen) {
      document.body.classList.add("movie-detail-open");
    } else {
      document.body.classList.remove("movie-detail-open");
    }

    return () => {
      document.body.classList.remove("movie-detail-open");
    };
  }, [isDetailOpen]);

  const detailModal = (
    <MovieDetailPanel
      title={title}
      rate={rate}
      genre={genre}
      coverImage={image}
      description={description}
      trailerLink={trailerLink}
      videoUrl={videoUrl}
      movieLength={movieLength}
      onClose={closeDetail}
    />
  );

  return (
    <>
      <div className="card-container" onClick={openDetail}>
        <div className="card-wrapper">
          <FlippingCardFront
            trailerLink={trailerLink}
            coverImage={image}
            rate={rate}
            movieLength={movieLength}
            genre={genre}
            title={title}
          />
        </div>
      </div>

      {isDetailOpen && ReactDOM.createPortal(detailModal, document.body)}
    </>
  );
}