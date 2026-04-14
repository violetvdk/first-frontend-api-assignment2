import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function GetPositionComponents() {
    const [positions, setPositions] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        fetchPositions().then((links) => {
            fetchJSONSfromPositions(links).then((positionList) => {
                setPositions(positionList);
            });
        });
    }, []);

    function handleDeletedPosition(payload) {
        setDeleteError("");
        setPositions((previous) => previous.filter((position) => position.url !== payload.url));
    }

    function handleDeleteError(message) {
        setDeleteError(message);
    }

    return (
        <>
            {deleteError && <p className="post-message post-error resource-feedback">{deleteError}</p>}
            <div className="resource-list">
                {positions.map((position) => (
                    <div className="resource-card resource-card-row" key={position.url}>
                        <Link className="resource-link" to={`/positions/${encodeURIComponent(position.url)}`}>
                            {position.url}
                        </Link>
                        <DeleteButton
                            resourceUrl={position.url}
                            requestInfo={buildDeleteRequestInfo()}
                            payloadInfo={{ url: position.url, type: "position" }}
                            onDeleted={handleDeletedPosition}
                            onError={handleDeleteError}
                        />
                    </div>
                ))}
            </div>
            <div className="post-button">
                <button className="post-btn post-btn-primary" onClick={() => setIsPostOpen(true)}>Post</button>
                {isPostOpen && (
                    <PostScreen category="positions" onClose={() => setIsPostOpen(false)} />
                )}
            </div>
        </>
    );
}

async function fetchPositions() {
    let index = await fetchIndex();
    let result = await fetch(index["positions"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for positions failed with status ' + response.status);
        }
    });
    return (await result.json())["positions"];
}

async function fetchJSONSfromPositions(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromPosition(link));
    }
    return list;
}

async function fetchJSONfromPosition(link) {
    let result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for position details failed with status ' + response.status);
        }
    });
    return await result.json();
}

export default GetPositionComponents;