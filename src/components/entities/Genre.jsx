import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function GetGenreComponent() {
    const {url} = useParams();
    const [genre, setGenre] = useState({});

    useEffect(() => {
        const link = decodeURIComponent(url);
        fetchJSONfromGenre(link).then(setGenre);
    }, [url]);

    return (
        <div className="entity-table-wrapper">
            <table className="entity-table">
                <tbody>
                {Object.entries(genre).map(([key, value]) => (
                    <tr key={key}>
                        <th>{key}</th>
                        <td>{makeCellContent(key, value)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
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

async function fetchNameFromLink(link) {
    let result = await fetch(link);
    return (await result.json()).name;
}

function AudiobooksCell({value}){
    const[names, setNames] = useState({});

    useEffect(() => {
        Promise.all(value.map(async (v) => [v,await fetchNameFromLink(v)])).then(entries => {
            setNames(Object.fromEntries(entries));
        });
    }, [value]);

    return value.map((v) => (
        <div key={`genres-${v}`}>
            <Link to={`/audiobooks/${encodeURIComponent(v)}`}>
                {names[v] || String(v)}
            </Link>
        </div>
    ));
}

function makeCellContent(key, value) {
    if (key === "audiobooks") {
        return <AudiobooksCell value={value}/>;
    }

    if (key === "url") {
        return (
            <Link to={`/genres/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link>
        );
    }

    if (key === "index") {
        return (
            <Link to="/genres">
                {String(value)}
            </Link>
        );
    }

    return String(value);
}

export default GetGenreComponent;