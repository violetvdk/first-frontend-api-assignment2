import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function GetPositionComponents() {
    const pageAmount = 100;
    const [positions, setPositions] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);
    const [deleteError, setDeleteError] = useState("");
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const links = await fetchPositionsPage(min, max);
                const items = await fetchJSONSfromPositions(links);
                if (!ignore) {
                    setPositions(items);
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
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({...position, mode: "PUT"})}
                        >
                            PUT
                        </button>
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({ ...position, mode: "PATCH" })}
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
                        category="positions"
                        mode={editing?.mode || "POST"}
                        initialData={editing.mode === "POST" ? null : editing}
                        onClose={() => setEditing(null)}
                        onSuccess={() => {
                            setEditing(null);
                            fetchPositionsPage(min, max).then((links) => {
                                fetchJSONSfromPositions(links).then(setPositions);
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
                    const length = await fetchPositionsLength();

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

async function fetchPositionsPage(min, max) {
    const index = await fetchIndex();
    const result = await fetch(index["positions"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for positions failed with status ' + response.status);
        }
    });
    const data = await result.json();
    return data.positions.slice(min, max);
}

async function fetchPositionsLength() {
    const index = await fetchIndex();
    const result = await fetch(index["positions"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for positions failed with status ' + response.status);
        }
    });
    return (await result.json())["positions"].length;
}

async function fetchJSONSfromPositions(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromPosition(link));
    }
    return list;
}

async function fetchJSONfromPosition(link) {
    const result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for position details failed with status ' + response.status);
        }
    });
    const data = await result.json();
    const etag = result.headers.get("ETag");
    return {...data, etag};
}

export default GetPositionComponents;