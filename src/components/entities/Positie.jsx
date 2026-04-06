import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function GetPositionComponent() {
    const {url} = useParams();
    const [position, setPosition] = useState([]);
    useEffect(() => {
        const link = decodeURIComponent(url);
        fetchJSONfromPosition(link).then(setPosition);
    }, [url]);
    return <div>{makePositionComponent(position)}</div>;
}

async function fetchJSONfromPosition(link) {
    let result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for position details failed with status ' + response.status);
        }
    });
    return await result.json();
}

function makePositionComponent(position) {
    return Object.entries(position).map(([key, value]) => makeItem(key, value));
}

function makeItem(key, value) {
    if (["user", "audiobook"].includes(key)) {
        return (
            <div key={key}><span>{key}: </span><Link to={`/${key}s/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link></div>
        )
    }
    else if (key === "url") {
        return (
            <div key={key}><span>{key}: </span><Link to={`/positions/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link></div>
        )
    }
    else if (key === "index") {
        return (
            <div key={key}><span>{key}: </span><Link to={`/positions`}>
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

export default GetPositionComponent;