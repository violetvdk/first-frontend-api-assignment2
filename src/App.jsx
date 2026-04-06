import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
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

function App() {
  return (<BrowserRouter>
        <Routes>
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
            <Route path="/*" element={<Navigate to={'/home'} />}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App
