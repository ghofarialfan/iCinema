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
  const imageSrc = coverImage || noPoster;
  return (
    <div className="front">
      <img src={imageSrc} alt="coverImage" />
      <div className="card-footer">
        <h4> {title} </h4>
        <p>
          {movieLength} / {genre.map((g) => g.name).join(", ")}
        </p>

        <a
          href={trailerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="trailer-btn"
        >
          watch trailer
        </a>
      </div>
      <span className="like"> {rate}</span>
    </div>
  );
};
export default CardFront;
