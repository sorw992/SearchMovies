import { useEffect, useRef, useState } from "react";
import { KEY } from "../../../App";
import { useKey } from "../../../useKey";
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

  // derived state
  /* note: if it's not watched then show the StarRating component */
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  // note: ? here is "optional chaining" because there might be actually no movie in the list. so if we haven't watched the movie then find() method return nothing. so then we need here "optional chaining".
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  // declare multiple variables
  // problem with understainding it
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

  // if (imdbRating > 8) return <p>Greatest ever!</p>;
  // if (imdbRating > 8) [isTop, setIsTop] = useState(true);

  // const [isTop, setIsTop] = useState(imdbRating > 8);
  // console.log(isTop);
  // useEffect(
  //   function () {
  //     setIsTop(imdbRating > 8);
  //   },
  //   [imdbRating]
  // );

  // derived state
  const isTop = imdbRating > 8;
  console.log(isTop);

  // const [avgRating, setAvgRating] = useState(0);

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

    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating) => (avgRating + userRating) / 2);
  }

  // custom hook
  // note: if user press esc buton call this function
  // onCloseMovie: function without () lets react to run it at a later point
  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      // todo: error handling not implemented
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
            // note: err.message will return string message from -> throw new Error("");

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

  // note : change the title of the page  (in the browser) with useeffect
  // we used useEffect to register side effect in render logic
  // we should always use different useEffect for different things.
  useEffect(
    function () {
      // if there is no title then just return (prevent to show temp title "undefined" in the browser)
      // if title is undefined returns false then !undefined returns true.
      if (!title) return;
      //note: change the title of the page (in the browser) by setting document.title
      document.title = `Movie | ${title}`;

      // note: clean up function (third part of the useEffect)
      // note: this clean up function will actually run after the component has already unmounted.
      // when user presses back button in movie detail component, the page title will be reset from movie title to usePopcorn
      return function () {
        document.title = "usePopcorn";
        // note: this clean up function will actually run after the component has already unmounted. but it's a javascript closure means a function will always remember all the variables that were present at the time and the place that the function was created. and our clean up function was created by the time this effect was created here.
        // console.log(`Clean up effect for movie ${title}`);
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
