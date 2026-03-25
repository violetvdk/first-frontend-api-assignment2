import './App.css'
import {useEffect, useState} from "react";

async function getUserComponents() {
  let links = [];
  try {
    links = await fetchUsers();
  } catch (error) {
    console.log(error + " in getUserComponents");
  }
  const users = [];
  for (let link of links) {
    const user = await fetchJSONfromUser(link);
    users.push(user);
  }
  return (<div>
    {
      users.map((user) => makeUserComponent(user))
    }
  </div>);
}

async function fetchJSONfromUser(link) {
  return fetch(link).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('API call for user details failed with status ' + response.status);
    }
  });
}

function makeUserComponent(user) {
  return <div>
    <h3>Naam: {user["name"]}</h3>
  </div>
}

async function fetchUsers() {
  let result = await fetch('https://groep40.webdev.stud.atlantis.ugent.be/user-7').then(response => {
    if (response.ok) {
      return response;
    } else {
      throw new Error('API call for users failed with status ' + response.status);
    }
  });
  return (await result.json())["users"];
}

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
