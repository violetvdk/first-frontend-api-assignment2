import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../../App.css"

function GetAudiobookComponents() {
    const [audiobooks, setAudiobooks] = useState([]);
    useEffect(() => {
        fetchAudiobooks().then((links) => {
            fetchJSONSfromAudiobooks(links).then((audiobooks) => {
                setAudiobooks(audiobooks.map((audiobook) => (
                    <div key={audiobook.url}>
                        <Link className="link" to={`/audiobooks/${encodeURIComponent(audiobook.url)}`}>
                            {audiobook.url}
                        </Link>
                    </div>
                )));
            });
        });
    }, []);
    return (<>{audiobooks}</>);
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