import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function GetAudiobookComponent() {
    const {url} = useParams();
    const [audiobook, setAudiobook] = useState({});

    useEffect(() => {
        const link = decodeURIComponent(url);
        fetchJSONfromAudiobook(link).then(setAudiobook);
    }, [url]);

    return (
        <div className="entity-table-wrapper">
            <table className="entity-table">
                <tbody>
                {Object.entries(audiobook).map(([key, value]) => (
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

async function fetchNameFromLink(link) {
    let result = await fetch(link);
    return (await result.json()).name;
}

function GenresCell({value}){
    const[names, setNames]=useState({});

    useEffect(()=> {
        Promise.all(value.map(async (v) => [v, await fetchNameFromLink(v)])).then(entries => {
            setNames(Object.fromEntries(entries));
        });
    }, [value]);

    return value.map((v) => (
        <div key={`genres-${v}`}>
            <Link to={`/genres/${encodeURIComponent(v)}`}>
                {names[v] || String(v)}
            </Link>
        </div>
    ));
}

function makeCellContent(key, value) {
    if (["reviews", "positions"].includes(key)) {
        return value.map((v) => (
            <div key={`${key}-${v}`}>
                <Link to={`/${key}/${encodeURIComponent(v)}`}>
                    {String(v)}
                </Link>
            </div>
        ));
    }

    if (key === "genres") {
        return <GenresCell value={value}/>;
    }

    if (key === "url") {
        return (
            <Link to={`/audiobooks/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link>
        );
    }

    if (key === "index") {
        return (
            <Link to="/audiobooks">
                {String(value)}
            </Link>
        );
    }

    if (key === "authors") {
        return value.map((v) => <div key={`${key}-${v}`}>{String(v)}</div>);
    }

    if (key === "link") {
        return (
            <Link to={`${value}`}>
                {String(value)}
            </Link>
        );
    }

    return String(value);
}

export default GetAudiobookComponent;