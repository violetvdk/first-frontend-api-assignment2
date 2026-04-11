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

function makeCellContent(key, value) {
    if (key === "audiobooks") {
        return value.map((v) => (
            <div key={`${key}-${v}`}>
                <Link to={`/${key}/${encodeURIComponent(v)}`}>
                    {String(v)}
                </Link>
            </div>
        ));
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