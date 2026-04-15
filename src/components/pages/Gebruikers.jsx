import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function Gebruikers() {
    const pageAmount = 100;
    const [users, setUsers] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        fetchUsersPage(min, max).then((links) => {
            fetchJSONSfromUsers(links).then((userList) => {
                setUsers(userList);
            });
        });
    }, [min, max]);

    function handleDeletedUser(payload) {
        setDeleteError("");
        setUsers((previous) => previous.filter((user) => user.url !== payload.url));
    }

    function handleDeleteError(message) {
        setDeleteError(message);
    }

    return (
        <>
            {deleteError && <p className="post-message post-error resource-feedback">{deleteError}</p>}
            <div className="resource-list">
                {users.map((user) => (
                    <div className="resource-card resource-card-row" key={user.url}>
                        <Link className="resource-link" to={`/users/${encodeURIComponent(user.url)}`}>
                            {user.url}
                        </Link>
                        <DeleteButton
                            resourceUrl={user.url}
                            requestInfo={buildDeleteRequestInfo()}
                            payloadInfo={{ url: user.url, type: "user" }}
                            onDeleted={handleDeletedUser}
                            onError={handleDeleteError}
                        />
                    </div>
                ))}
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