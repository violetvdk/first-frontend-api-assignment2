import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function GetGenreComponent() {
    const {url} = useParams();
    const [genre, setGenre] = useState([]);
    useEffect(() => {
        const link = decodeURIComponent(url);
        fetchJSONfromGenre(link).then(setGenre);
    }, [url]);
    return <div>{makeGenreComponent(genre)}</div>;
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

function makeGenreComponent(genre) {
    return Object.entries(genre).map(([key, value]) => makeItem(key, value));
}

function makeItem(key, value) {
    if (["audiobooks"].includes(key)) {
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
            <div key={key}><span>{key}: </span><Link to={`/genres/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link></div>
        )
    }
    else if (key === "index") {
        return (
            <div key={key}><span>{key}: </span><Link to={`/genres`}>
                {String(value)}
            </Link></div>
        )
    }
    else return (
            <div key={key}>
                {String(key + ": " + value)}
            </div>
        )
}

export default GetGenreComponent;