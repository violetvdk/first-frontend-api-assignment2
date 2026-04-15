import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function GetGenreComponents() {
    const pageAmount = 100;
    const [genres, setGenres] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);
    const [deleteError, setDeleteError] = useState("");
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const links = await fetchGenresPage(min, max);
                const items = await fetchJSONSfromGenres(links);
                if (!ignore) {
                    setGenres(items);
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

    function handleDeletedGenre(payload) {
        setDeleteError("");
        setGenres((previous) => previous.filter((genre) => genre.url !== payload.url));
    }

    function handleDeleteError(message) {
        setDeleteError(message);
    }

    return (
        <>
            {deleteError && <p className="post-message post-error resource-feedback">{deleteError}</p>}
            <div className="resource-list">
                {genres.map((genre) => (
                    <div className="resource-card resource-card-row" key={genre.url}>
                        <Link className="resource-link" to={`/genres/${encodeURIComponent(genre.url)}`}>
                            {genre.url}
                        </Link>
                        <DeleteButton
                            resourceUrl={genre.url}
                            requestInfo={buildDeleteRequestInfo()}
                            payloadInfo={{ url: genre.url, type: "genre" }}
                            onDeleted={handleDeletedGenre}
                            onError={handleDeleteError}
                        />
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({...genre, mode: "PUT"})}
                        >
                            PUT
                        </button>
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({ ...genre, mode: "PATCH" })}
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
                        category="genres"
                        mode={editing?.mode || "POST"}
                        initialData={editing.mode === "POST" ? null : editing}
                        onClose={() => setEditing(null)}
                        onSuccess={() => {
                            setEditing(null);
                            fetchGenresPage(min, max).then((links) => {
                                fetchJSONSfromGenres(links).then(setGenres);
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
                    const length = await fetchGenresLength();
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

async function fetchGenresPage(min, max) {
    const index = await fetchIndex();
    const result = await fetch(index["genres"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genres failed with status ' + response.status);
        }
    });
    const data = await result.json();
    return data.genres.slice(min, max);
}

async function fetchGenresLength() {
    const index = await fetchIndex();
    const result = await fetch(index["genres"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genres failed with status ' + response.status);
        }
    });
    return (await result.json())["genres"].length;
}

async function fetchJSONSfromGenres(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromGenre(link));
    }
    return list;
}

async function fetchJSONfromGenre(link) {
    const result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genre details failed with status ' + response.status);
        }
    });
    const data = await result.json();
    const etag = result.headers.get("ETag");
    return {...data, etag};
}

export default GetGenreComponents;