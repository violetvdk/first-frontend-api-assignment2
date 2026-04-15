import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../../App.css"
import PostScreen from "../pop-ups/post/PostScreen.jsx";

function GetAudiobookComponents() {
    const pageAmount = 100;
    const [audiobooks, setAudiobooks] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);

    useEffect(() => {
        fetchAudiobooksPage(min, max).then((links) => {
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
    }, [min, max]);

    return (
        <>
            <div className="resource-list">
                {audiobooks}
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
            </div>
            <div className="post-button">
                <button className="myButton" onClick={() => setIsPostOpen(true)}>POST</button>
                {isPostOpen && (
                    <PostScreen category="audiobooks" onClose={() => setIsPostOpen(false)}/>
                )}
            </div>
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
    return await result.json();
}

export default GetAudiobookComponents;