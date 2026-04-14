import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../../App.css"
import PostScreen from "../pop-ups/post/PostScreen.jsx";

function GetAudiobookComponents() {
    const [audiobooks, setAudiobooks] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    useEffect(() => {
        fetchAudiobooks().then((links) => {
            fetchJSONSfromAudiobooks(links).then((audiobooks) => {
                setAudiobooks(audiobooks.map((audiobook) => (
                    <div className="resource-card" key={audiobook.url}>
                        <Link className="resource-link" to={`/audiobooks/${encodeURIComponent(audiobook.url)}`}>
                            {audiobook.url}
                        </Link>
                    </div>
                )));
            });
        });
    }, []);
    return (<><div className="resource-list">{audiobooks}</div>
        <div className="post-button">
            <button className="myButton" onClick={() => setIsPostOpen(true)}>POST</button>
            {isPostOpen && (
                <PostScreen category="audiobooks" onClose={() => setIsPostOpen(false)} />
            )}
        </div></>);
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