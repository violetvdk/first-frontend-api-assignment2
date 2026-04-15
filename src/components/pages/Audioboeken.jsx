import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../../App.css"
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function GetAudiobookComponents() {
    const pageAmount = 100;
    const [audiobooks, setAudiobooks] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);
    const [deleteError, setDeleteError] = useState("");
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const links = await fetchAudiobooksPage(min, max);
                const items = await fetchJSONSfromAudiobooks(links);
                if (!ignore) {
                    setAudiobooks(items);
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

    function handleDeletedAudiobook(payload) {
        setDeleteError("");
        setAudiobooks((previous) => previous.filter((audiobook) => audiobook.url !== payload.url));
    }

    function handleDeleteError(message) {
        setDeleteError(message);
    }

    return (
        <>
            {deleteError && <p className="post-message post-error resource-feedback">{deleteError}</p>}
            <div className="resource-list">
                {audiobooks.map((audiobook) => (
                    <div className="resource-card resource-card-row" key={audiobook.url}>
                        <Link className="resource-link" to={`/audiobooks/${encodeURIComponent(audiobook.url)}`}>
                            {audiobook.url}
                        </Link>
                        <DeleteButton
                            resourceUrl={audiobook.url}
                            requestInfo={buildDeleteRequestInfo()}
                            payloadInfo={{ url: audiobook.url, type: "audiobook" }}
                            onDeleted={handleDeletedAudiobook}
                            onError={handleDeleteError}
                        />
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({...audiobook, mode: "PUT"})}
                        >
                            PUT
                        </button>
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({ ...audiobook, mode: "PATCH" })}
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
                        category="audiobooks"
                        mode={editing?.mode || "POST"}
                        initialData={editing.mode === "POST" ? null : editing}
                        onClose={() => setEditing(null)}
                        onSuccess={() => {
                            setEditing(null);
                            fetchAudiobooksPage(min, max).then((links) => {
                                fetchJSONSfromAudiobooks(links).then(setAudiobooks);
                            });
                        }}
                    />
                )}
            </div>
            <button className="previousPage"
                    onClick={() => {
                        setMin((prev) => Math.max(prev - pageAmount, 0));
                        setMax((prev) => Math.max(prev - pageAmount, pageAmount));
                    }}>
                Previous
            </button>
            <button
                className="nextPage"
                onClick={async () => {
                    const length = await fetchAudiobooksLength();
                    setMin((prevMin) => {
                        const nextMin = prevMin + pageAmount;
                        if (nextMin < length) {
                            setMax(nextMin + pageAmount);
                            return nextMin;
                        }
                        return prevMin;
                    });
                }}
            >Next
            </button>
        </>
    );
}

async function fetchAudiobooksPage(min, max) {
    const index = await fetchIndex();
    const result = await fetch(index["audiobooks"]);
    if (!result.ok) {
        throw new Error('API call for audiobooks failed with status ' + result.status);
    }
    const data = await result.json();
    return data.audiobooks.slice(min, max);
}

async function fetchAudiobooksLength() {
    const index = await fetchIndex();
    let result = await fetch(index["audiobooks"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for audiobooks failed with status ' + response.status);
        }
    });
    return (await result.json())["audiobooks"].length;
}

async function fetchJSONSfromAudiobooks(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromAudiobook(link));
    }
    return list;
}

async function fetchJSONfromAudiobook(link) {
    const result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for audiobook details failed with status ' + response.status);
        }
    });
    const data = await result.json();
    const etag = result.headers.get("ETag");
    return {...data, etag};
}

export default GetAudiobookComponents;