import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function Gebruikers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers().then((links) => {
            fetchJSONSfromUsers(links).then((users) => {
                setUsers(users.map((user) => (
                    <div className="resource-card" key={user.url}>
                        <Link className="resource-link" to={`/users/${encodeURIComponent(user.url)}`}>
                            {user.url}
                        </Link>
                    </div>
                )));
            });
        });
    }, []);

    return <div className="resource-list">{users}</div>;
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

export default Gebruikers;