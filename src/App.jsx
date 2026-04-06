import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Gebruikers from "./components/pages/Gebruikers.jsx";
import Gebruiker from "./components/entities/Gebruiker.jsx";
import Home from "./components/pages/Home.jsx";
import Audioboeken from "./components/pages/Audioboeken.jsx";
import Genres from "./components/pages/Genres.jsx";
import Posities from "./components/pages/Posities.jsx";

function App() {
  return (<BrowserRouter>
        <Routes>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/users" element={<Gebruikers/>}></Route>
            <Route path="/users/:url" element={<Gebruiker/>}></Route>
            <Route path="/audiobooks" element={<Audioboeken/>}></Route>
            <Route path="/genres" element={<Genres/>}></Route>
            <Route path="/positions" element={<Posities/>}></Route>
            <Route path="/*" element={<Navigate to={'/home'} />}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App
