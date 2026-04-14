import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../../App.css"
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function GetAudiobookComponents() {
    const [audiobooks, setAudiobooks] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        fetchAudiobooks().then((links) => {
            fetchJSONSfromAudiobooks(links).then((items) => {
                setAudiobooks(items);
            });
        });
    }, []);

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
                    </div>
                ))}
            </div>
            <div className="post-button">
                <button className="post-btn post-btn-primary" onClick={() => setIsPostOpen(true)}>Post</button>
                {isPostOpen && (
                    <PostScreen category="audiobooks" onClose={() => setIsPostOpen(false)} />
                )}
            </div>
        </>
    );
}


async function fetchAudiobooks() {
    let index = await fetchIndex();
    let result = await fetch(index["audiobooks"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for audiobooks failed with status ' + response.status);
        }
    });
    return (await result.json())["audiobooks"];
}

async function fetchJSONSfromAudiobooks(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromAudiobook(link));
    }
    return list;
}

async function fetchJSONfromAudiobook(link) {
    let result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for audiobook details failed with status ' + response.status);
        }
    });
    return await result.json();
}

export default GetAudiobookComponents;