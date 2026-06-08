import React, { useState } from "react";

import FlippingCardFront from "./CardFront";
import FlippingCardBack from "./CardBack";
import "./style.css";

export default function MovieCard({ movie }) {
  const [isFlipped, setIsFlipped] = useState(false);

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

  const handleFlipCard = () => {
    setIsFlipped((prevState) => !prevState);
  };

  return (
    <div className="card-container">
      <div
        className={isFlipped ? "card-wrapper flipped" : "card-wrapper"}
        onClick={handleFlipCard}
      >
        <FlippingCardFront
          trailerLink={trailerLink}
          coverImage={image}
          rate={rate}
          movieLength={movieLength}
          genre={genre}
          title={title}
        />

        <FlippingCardBack
          title={title}
          rate={rate}
          genre={genre}
          description={description}
          trailerLink={trailerLink}
          videoUrl={videoUrl}
          movieLength={movieLength}
        />
      </div>
    </div>
  );
}