import fetchIndex from "../index.js";

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
            users.map((user) => (
                <div key={user.url}>
                    {user.name}
                </div>
            ))
        }
    </div>);
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

async function fetchJSONfromUser(link) {
    return fetch(link).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('API call for user details failed with status ' + response.status);
        }
    });
}

export default getUserComponents;