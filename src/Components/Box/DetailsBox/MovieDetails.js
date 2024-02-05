import { useEffect, useRef, useState } from "react";
import { KEY } from "../../../pages/Home";
import { useKey } from "../../../hooks/useKey";
import Loader from "../../OtherComponents/Loader";
import StarRating from "../../StarRating/StarRating";
import ErrorMessage from "../../OtherComponents/ErrorMessage";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const [error, setError] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      // if (userRating) is not equal to "" (user rates at least one time)
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  // if it's not watched then show the StarRating component
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const isTop = imdbRating > 8;
  console.log(isTop);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      // e.g. "148 min" -> "148"
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  // if user press esc buton call this function
  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovie(data);
          setIsLoading(false);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            // err.message will return string message from -> throw new Error("");

            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      // if there is no title then just return (prevent to show temp title "undefined" in the browser)
      // if title is undefined returns false then !undefined returns true.
      if (!title) return;
      // change the title of the page (in the browser) by setting document.title
      document.title = `Movie | ${title}`;

      // clean up function
      // when user presses back button in movie detail component, the page title will be reset from movie title to Search Movies
      return function () {
        document.title = "Search Movies";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}

      {/* note****: only one of these three conditions can be true at the same time */}

      {/* note: there is either loading and not loading and there is an error or no error */}
      {/* note: if the data is in loading show Loader component */}
      {isLoading && <Loader />}

      {/* note: if the data is not loading and there is no error */}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              {/* note: &larr: html entity: left arrow */}
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {/* note: &bull is dot (.) */}
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          {/* <p>{avgRating}</p> */}

          <section>
            <div className="rating">
              {/* note: if it's not watched then show the StarRating component */}
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {/* note: if user select a star more than 0 the add to list button will show */}
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              {/* em tag for emphasize */}
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}

      {error && <ErrorMessage message={error} />}
    </div>
  );
}
