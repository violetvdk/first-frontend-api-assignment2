import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Gebruikers from "./components/pages/Gebruikers.jsx";

function App() {
  return (<BrowserRouter>
        <Routes>
          <Route path="/home" element={<Gebruikers/>}></Route>
          <Route path="/*" element={<Navigate to={'/home'} />}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App
