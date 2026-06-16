import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";

import { search, categorize, filterRating } from "../../utils";
import { MoviesTable, Pagination } from "../../components";
import { Input, Loading, ListGroup, Rating } from "../../components/common";

import { getMovies } from "../../actions/moviesAction";
import { getGenres } from "../../actions/genreAction";

import "./style.css";

const Movies = (props) => {
  const [pageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentGenre, setCurrentGenre] = useState("All");
  const [searchFilter, setSearchFilter] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    props.getMovies();
    props.getGenres();
  }, [props.loggedIn, props.getMovies, props.getGenres]);

  const handleChange = (name, value) => {
    if (name === "currentGenre") {
      setCurrentGenre(value);
    } else if (name === "searchFilter") {
      setSearchFilter(value);
    } else if (name === "rating") {
      setRating(value);
    }

    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setCurrentGenre("All");
    setSearchFilter("");
    setRating(0);
    setCurrentPage(1);
  };

  const handleExploreCollection = () => {
    const collectionSection = document.querySelector(".movies-layout");

    if (collectionSection) {
      collectionSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const { loading } = props;
  const movies = props.movies || [];
  const genres = props.genres || [];
  const allGenres = [{ name: "All" }, ...genres];

  const filteredMovies = useMemo(() => {
    let result = search(movies, searchFilter, "title");
    result = categorize(result, currentGenre);
    result = filterRating(result, Number(rating));
    return result;
  }, [movies, searchFilter, currentGenre, rating]);

  const latestMovie = movies.length > 0 ? movies[movies.length - 1] : null;

  const latestMovieGenres =
    latestMovie && Array.isArray(latestMovie.genre)
      ? latestMovie.genre
          .map((genreItem) =>
            typeof genreItem === "object" ? genreItem.name : genreItem
          )
          .filter(Boolean)
          .join(", ")
      : "No genre available";

  const quickGenres = allGenres.slice(0, 5);

  const isFilterActive =
    currentGenre !== "All" || searchFilter.trim() !== "" || Number(rating) > 0;

  if (loading) {
    return (
      <div className="movies-page movies-loading-page">
        <div className="movies-loading-card">
          <Loading />
          <p>Loading iCinema collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="movies-container">
        <section className="movies-hero">
          <div className="movies-hero-content">
            <div className="movies-hero-main">
              <span className="movies-hero-badge">iCinema Movie Library</span>

              <h1>Discover Movies That Match Your Taste</h1>

              <p>
                Browse film collections, explore genres, and filter movies based
                on your preferred rating through a cleaner and more interactive
                viewing experience.
              </p>

              <div className="movies-hero-search">
                <Input
                  onChange={(event) =>
                    handleChange("searchFilter", event.target.value)
                  }
                  label=""
                  iconClass="fas fa-search"
                  placeholder="Search movie title..."
                  value={searchFilter}
                />
              </div>

              <div className="movies-hero-actions">
                <button
                  type="button"
                  className="movies-hero-primary-button"
                  onClick={handleExploreCollection}
                >
                  Explore Collection
                </button>

                <button
                  type="button"
                  className={
                    isFilterActive
                      ? "movies-hero-secondary-button active"
                      : "movies-hero-secondary-button"
                  }
                  onClick={handleResetFilter}
                  disabled={!isFilterActive}
                >
                  Clear Filters
                </button>
              </div>

              <div className="movies-hero-quick-genres">
                {quickGenres.map((genreItem) => (
                  <button
                    key={genreItem.name}
                    type="button"
                    className={
                      currentGenre === genreItem.name
                        ? "movies-quick-genre active"
                        : "movies-quick-genre"
                    }
                    onClick={() =>
                      handleChange("currentGenre", genreItem.name)
                    }
                  >
                    {genreItem.name}
                  </button>
                ))}
              </div>

              <div className="movies-hero-stats">
                <div className="movies-stat-card">
                  <strong>{movies.length}</strong>
                  <span>Total Movies</span>
                </div>

                <div className="movies-stat-card">
                  <strong>{genres.length}</strong>
                  <span>Genres</span>
                </div>

                <div className="movies-stat-card">
                  <strong>{filteredMovies.length}</strong>
                  <span>Results</span>
                </div>
              </div>
            </div>

            <div className="movies-featured-card">
              <span className="movies-featured-label">Latest Added</span>

              {latestMovie ? (
                <>
                  <div className="movies-featured-poster">
                    <img
                      src={latestMovie.image}
                      alt={latestMovie.title || "Latest movie"}
                    />
                    <div className="movies-featured-poster-overlay"></div>
                  </div>

                  <div className="movies-featured-content">
                    <h4>{latestMovie.title || "Untitled Movie"}</h4>

                    <p>{latestMovieGenres || "Uncategorized"}</p>

                    <div className="movies-featured-meta">
                      <span>{latestMovie.rate || 0} Rating</span>
                      <span>{latestMovie.movieLength || "Unknown duration"}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="movies-featured-empty">
                  <h4>No Movie Yet</h4>
                  <p>Add movie data to highlight the latest collection here.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="movies-layout">
          <aside className="movies-sidebar">
            <div className="movies-filter-card">
              <div className="movies-filter-header">
                <div>
                  <h4>Filters</h4>
                  <p>Refine movies by genre and rating.</p>
                </div>

                <div className="movies-filter-icon">
                  <i className="fas fa-sliders-h"></i>
                </div>
              </div>

              <div className="movies-filter-section">
                <h6>Genre</h6>
                <ListGroup
                  active={currentGenre}
                  onChange={(val) => handleChange("currentGenre", val)}
                  options={allGenres}
                />
              </div>

              <div className="movies-filter-section">
                <h6>Minimum Rating</h6>

                <div className="movies-rating-box">
                  <Rating
                    total={10}
                    filled={rating}
                    onChange={(val) => handleChange("rating", val)}
                  />

                  <p>
                    {rating > 0
                      ? `Showing movies with rating ${rating}+`
                      : "No minimum rating selected"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={
                  isFilterActive
                    ? "movies-reset-button active"
                    : "movies-reset-button"
                }
                onClick={handleResetFilter}
                disabled={!isFilterActive}
              >
                Reset Filters
              </button>
            </div>
          </aside>

          <main className="movies-main">
            <section className="movies-search-card">
              <div className="movies-search-info">
                <h3>Movie Collection</h3>
                <p>
                  Search movie titles and combine filters to find the most
                  relevant collection faster.
                </p>
              </div>

              <div className="movies-search-input">
                <Input
                  onChange={(event) =>
                    handleChange("searchFilter", event.target.value)
                  }
                  label="Search Movie"
                  iconClass="fas fa-search"
                  placeholder="Search movie title..."
                  value={searchFilter}
                />
              </div>
            </section>

            <section className="movies-result-summary">
              <div>
                <h5>
                  {filteredMovies.length}{" "}
                  {filteredMovies.length === 1 ? "movie" : "movies"} found
                </h5>

                <p>
                  {isFilterActive
                    ? `Active filter: ${
                        currentGenre !== "All" ? currentGenre : "All genres"
                      }${rating > 0 ? ` • Rating ${rating}+` : ""}${
                        searchFilter.trim()
                          ? ` • Keyword "${searchFilter.trim()}"`
                          : ""
                      }`
                    : "Showing all available movies"}
                </p>
              </div>

              <span className="movies-live-badge">
                <i className="fas fa-check-circle"></i>
                Live Collection
              </span>
            </section>

            <section className="movies-table-wrapper">
              {filteredMovies.length > 0 ? (
                <MoviesTable
                  pageSize={pageSize}
                  currentPage={currentPage}
                  movies={filteredMovies}
                />
              ) : (
                <div className="movies-empty-state">
                  <div className="movies-empty-icon">
                    <i className="fas fa-film"></i>
                  </div>

                  <h3>No Movies Found</h3>

                  <p>
                    We could not find movies that match your current filter. Try
                    changing the keyword, genre, or rating preference.
                  </p>

                  <button
                    type="button"
                    className="movies-empty-button"
                    onClick={handleResetFilter}
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </section>

            <div className="movies-pagination">
              <Pagination
                itemsCount={filteredMovies.length}
                pageSize={pageSize}
                onPageChange={onPageChange}
                currentPage={currentPage}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    movies: state.movie.movies,
    genres: state.genre.genres,
    loggedIn: state.auth.loggedIn,
    loading: state.movie.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMovies: () => dispatch(getMovies()),
    getGenres: () => dispatch(getGenres()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
