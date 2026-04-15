import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";

function Gebruikers() {
    const pageAmount = 100;
    const [users, setUsers] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);

    useEffect(() => {
        fetchUsersPage(min, max).then((links) => {
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
    }, [min, max]);

    return (
        <>
            <div className="resource-list">
                {users}
                <button
                    className="previousPage"
                    onClick={() => {
                        setMin((prev) => Math.max(prev - pageAmount, 0));
                        setMax((prev) => Math.max(prev - pageAmount, pageAmount));
                    }}
                >
                    Previous
                </button>
                <button
                    className="nextPage"
                    onClick={async () => {
                        const length = await fetchUsersLength();
                        setMin((prevMin) => {
                            const nextMin = prevMin + pageAmount;

                            if (nextMin < length) {
                                setMax(nextMin + pageAmount);
                                return nextMin;
                            }
                            return prevMin;
                        });
                    }}
                >
                    Next
                </button>
            </div>
            <div className="post-button">
                <button className="myButton" onClick={() => setIsPostOpen(true)}>
                    POST
                </button>
                {isPostOpen && (
                    <PostScreen
                        category="users"
                        onClose={() => setIsPostOpen(false)}
                    />
                )}
            </div>
        </>
    );
}

async function fetchUsersPage(min, max) {
    const index = await fetchIndex();
    const result = await fetch(index["users"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for users failed with status ' + response.status);
        }
    });
    const data = await result.json();
    return data.users.slice(min, max);
}

async function fetchUsersLength() {
    const index = await fetchIndex();
    const result = await fetch(index["users"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for users failed with status ' + response.status);
        }
    });
    return (await result.json())["users"].length;
}

async function fetchJSONSfromUsers(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromUser(link));
    }
    return list;
}

async function fetchJSONfromUser(link) {
    const result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for user details failed with status ' + response.status);
        }
    });
    return await result.json();
}

export default Gebruikers;