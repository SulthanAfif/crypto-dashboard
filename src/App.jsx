import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CoinDetail from "./pages/CoinDetail";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("crypto-theme") !== "light";
  });

  useEffect(() => {
    document.body.classList.toggle("light", !darkMode);
    localStorage.setItem("crypto-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:id" element={<CoinDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
