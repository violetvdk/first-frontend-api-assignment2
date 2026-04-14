import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function Gebruikers() {
    const [users, setUsers] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        fetchUsers().then((links) => {
            fetchJSONSfromUsers(links).then((userList) => {
                setUsers(userList);
            });
        });
    }, []);

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
                <button className="post-btn post-btn-primary" onClick={() => setIsPostOpen(true)}>Post</button>
                {isPostOpen && (
                    <PostScreen category="users" onClose={() => setIsPostOpen(false)} />
                )}
            </div>
        </>
    );
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