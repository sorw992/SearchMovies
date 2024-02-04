import "./App.css";
import { useState } from "react";
import { useMovies } from "./useMovies";

import NavBar from "./Components/NavBar/NavBar";
import Search from "./Components/NavBar/Search";
import NumResults from "./Components/NavBar/NumResults";

function App() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [selectedId, setSelectedId] = useState(null);

  function handleCloseMovie() {
    setSelectedId(null);
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
    </>
  );
}

export default App;
