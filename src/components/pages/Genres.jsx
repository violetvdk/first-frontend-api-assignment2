import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function GetGenreComponents() {
    const [genres, setGenres] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        fetchGenres().then((links) => {
            fetchJSONSfromGenres(links).then((genreList) => {
                setGenres(genreList);
            });
        });
    }, []);

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
                    </div>
                ))}
            </div>
            <div className="post-button">
                <button className="post-btn post-btn-primary" onClick={() => setIsPostOpen(true)}>Post</button>
                {isPostOpen && (
                    <PostScreen category="genres" onClose={() => setIsPostOpen(false)} />
                )}
            </div>
        </>
    );
}

async function fetchGenres() {
    let index = await fetchIndex();
    let result = await fetch(index["genres"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genres failed with status ' + response.status);
        }
    });
    return (await result.json())["genres"];
}

async function fetchJSONSfromGenres(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromGenre(link));
    }
    return list;
}

async function fetchJSONfromGenre(link) {
    let result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genre details failed with status ' + response.status);
        }
    });
    return await result.json();
}

export default GetGenreComponents;