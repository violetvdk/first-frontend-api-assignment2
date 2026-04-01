import './App.css'
import {useEffect, useState} from "react";
import getUserComponents from "./data/gebruikers.jsx";

function App() {
  const [users, setUsers] = useState(<> </>);
  useEffect(() => {
    getUserComponents().then(users => setUsers(users));
  }, [setUsers]);

  return (
      users
  )
}

export default App
