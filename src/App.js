import "./App.css";
import { useState } from "react";
import { useMovies } from "./useMovies";

import NavBar from "./Components/NavBar/NavBar";
import Search from "./Components/NavBar/Search";
import NumResults from "./Components/NavBar/NumResults";

import Loader from "./Components/OtherComponents/Loader";
import ErrorMessage from "./Components/OtherComponents/ErrorMessage";
import Box from "./Components/Box/Box";

import MovieList from "./Components/Box/SearchResultBox/MovieList";

export default function App() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
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
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
