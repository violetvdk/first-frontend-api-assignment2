import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function Gebruikers() {
    const pageAmount = 100;
    const [users, setUsers] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);
    const [deleteError, setDeleteError] = useState("");
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const links = await fetchUsersPage(min, max);
                const items = await fetchJSONSfromUsers(links);
                if (!ignore) {
                    setUsers(items);
                }
            } catch (err) {
                console.error(err);
            }
        }
        void load();
        return () => {
            ignore = true;
        };
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
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({...user, mode: "PUT"})}
                        >
                            PUT
                        </button>
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({ ...user, mode: "PATCH" })}
                        >
                            PATCH
                        </button>
                    </div>
                ))}
            </div>
            <div className="post-button">
                <button className="post-btn post-btn-primary" onClick={() => setEditing({ mode: "POST" })}>POST</button>
                {editing && (
                    <PostScreen
                        category="users"
                        mode={editing?.mode || "POST"}
                        initialData={editing.mode === "POST" ? null : editing}
                        onClose={() => setEditing(null)}
                        onSuccess={() => {
                            setEditing(null);
                            fetchUsersPage(min, max).then((links) => {
                                fetchJSONSfromUsers(links).then(setUsers);
                            });
                        }}
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
    const data = await result.json();
    const etag = result.headers.get("ETag");
    return {...data, etag};
}

export default Gebruikers;