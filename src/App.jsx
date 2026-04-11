import {BrowserRouter, Link, Route, Routes, Navigate} from "react-router-dom";
import {useState} from "react";
import Home from "./components/pages/Home.jsx";
import Audioboeken from "./components/pages/Audioboeken.jsx";
import Genres from "./components/pages/Genres.jsx";
import Posities from "./components/pages/Posities.jsx";
import Reviews from "./components/pages/Reviews.jsx";
import Gebruikers from "./components/pages/Gebruikers.jsx";
import Audioboek from "./components/entities/Audioboek.jsx";
import Genre from "./components/entities/Genre.jsx";
import Positie from "./components/entities/Positie.jsx";
import Review from "./components/entities/Review.jsx";
import Gebruiker from "./components/entities/Gebruiker.jsx";
import Not_found from "./components/pages/Not_found.jsx";
import "./App.css";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (<BrowserRouter>
          <nav id="navigation-bar">
                <div className="nav-brand">
                  <button className="hamburger" onClick={toggleMenu}>
                    ☰
                  </button>
                  <Link className="brand-text" to="/home">Audiobooks API</Link>
                </div>
                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                  <Link className="desktop-home-link" to="/home" onClick={closeMenu}>Home</Link>
                  <Link to="/audiobooks" onClick={closeMenu}>Audioboeken</Link>
                  <Link to="/genres" onClick={closeMenu}>Genres</Link>
                  <Link to="/positions" onClick={closeMenu}>Posities</Link>
                  <Link to="/reviews" onClick={closeMenu}>Reviews</Link>
                  <Link to="/users" onClick={closeMenu}>Gebruikers</Link>
                </div>
          </nav>
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/audiobooks" element={<Audioboeken/>}></Route>
            <Route path="/audiobooks/:url" element={<Audioboek/>}></Route>
            <Route path="/genres" element={<Genres/>}></Route>
            <Route path="/genres/:url" element={<Genre/>}></Route>
            <Route path="/positions" element={<Posities/>}></Route>
            <Route path="/positions/:url" element={<Positie/>}></Route>
            <Route path="/reviews" element={<Reviews/>}></Route>
            <Route path="/reviews/:url" element={<Review/>}></Route>
            <Route path="/users" element={<Gebruikers/>}></Route>
            <Route path="/users/:url" element={<Gebruiker/>}></Route>
            <Route path="/*" element={<Not_found/>}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App