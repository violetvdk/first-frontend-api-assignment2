import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function GetAudiobookComponent() {
    const {url} = useParams();
    const [audiobook, setAudiobook] = useState([]);
    useEffect(() => {
        const link = decodeURIComponent(url);
        fetchJSONfromAudiobook(link).then(setAudiobook);
    }, [url]);
    return (<>
        <div key="index"><span>index: </span><Link to={`/audiobooks`}>{`/audiobooks`}</Link></div>
        <div>{makeAudiobookComponent(audiobook)}</div>
    </>);
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

function makeAudiobookComponent(audiobook) {
    return Object.entries(audiobook).map(([key, value]) => makeItem(key, value));
}

function makeItem(key, value) {
    if (["genres", "reviews", "positions"].includes(key)) {
        return (
            <div key={key}>
                <span>{key}: </span>
                {value.map((v) => (
                    <div key={v}>
                        <Link to={`/${key}/${encodeURIComponent(v)}`}>
                            {String(v)}
                        </Link>
                    </div>
                ))}
            </div>
        );
    }
    else if (key === "url") {
        return (
            <div key={key}><span>{key}: </span><Link to={`/audiobooks/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link></div>
        )
    }
    else if (key === "index") {
        return (
            <div key={key}><span>{key}: </span><Link to={`/audiobooks`}>
                {String(value)}
            </Link></div>
        )
    }
    else if (key === "authors") {
        return (
            <div key={key}>
                <span>{key}: </span>
                {value.map((v) => (
                    <div key={v}>
                        {String(v)}
                    </div>
                ))}
            </div>)
    }
    else return (
            <div key={key}>
                {String(key + ": " + value)}
            </div>
        )
}

export default GetAudiobookComponent;