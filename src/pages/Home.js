import "../App.css";
import { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

import NavBar from "../components/NavBar/NavBar";
import Search from "../components/NavBar/Search";
import NumResults from "../components/NavBar/NumResults";

import Loader from "../components/OtherComponents/Loader";
import ErrorMessage from "../components/OtherComponents/ErrorMessage";
import Box from "../components/Box/Box";

import MovieDetails from "../components/Box/DetailsBox/MovieDetails";
import WatchedMoviesList from "../components/Box/DetailsBox/WatchedMoviesList";
import MovieList from "../components/Box/SearchResultBox/MovieList";

import WatchedSummary from "../components/Box/DetailsBox/WatchedSummary";

export const KEY = "55859405";

export default function Home() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
