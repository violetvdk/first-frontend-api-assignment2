import fetchIndex from "../../index.js";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function GetUserComponents() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetchUsers().then((links) => {
            fetchJSONSfromUsers(links).then((users) => {
                setUsers(users.map((user) => (<div key={user.url}><Link to={`/users/${encodeURIComponent(user.url)}`}>
                    {user.url}
                </Link></div>)));
            });
        });
    }, []);
    return <>{users}</>;
}

async function fetchUsers() {
    let index = await fetchIndex();
    let result = await fetch(index["users"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for users failed with status ' + response.status);
        }
    });
    return (await result.json())["users"];
}

async function fetchJSONSfromUsers(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromUser(link));
    }
    return list;
}

async function fetchJSONfromUser(link) {
    let result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for user details failed with status ' + response.status);
        }
    });
    return await result.json();
}

export default GetUserComponents;