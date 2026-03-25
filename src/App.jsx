import { useState } from 'react'
import './App.css'

function getUserComponents() {
  let users = {};
  try {
    users = fetchUsers();
  } catch (error) {
    console.log(error);
  }
  return (<div>
    {
      users.map(user => makeUserComponent(fetchJSONfromUser(user)))
    }
  </div>)
}

function fetchJSONfromUser(user) {
    return fetch('https://groep40.webdev.stud.atlantis.ugent.be/user-7/' + user.id).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('API call for user details failed with status ' + response.status);
      }
    });
}

function makeUserComponent(user) {
  return <div>
    <h3>Naam: {user.name}</h3>
  </div>
}

function fetchUsers() {
  return fetch('https://groep40.webdev.stud.atlantis.ugent.be/user-7').then(response => {
    if (response.ok) {
        return response.json();
    } else {
      throw new Error('API call for users failed with status ' + response.status);
    }
  }).users
}

function App() {
  return (<>
    {
      getUserComponents()
    }
  </>)
}

export default App
