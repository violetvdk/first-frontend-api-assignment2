import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function GetReviewComponent() {
    const {url} = useParams();
    const [review, setReview] = useState({});

    useEffect(() => {
        const link = decodeURIComponent(url);
        fetchJSONfromReview(link).then(setReview);
    }, [url]);

    return (
        <div className="entity-table-wrapper">
            <table className="entity-table">
                <tbody>
                {Object.entries(review).map(([key, value]) => (
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

async function fetchJSONfromReview(link) {
    let result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for review details failed with status ' + response.status);
        }
    });
    return await result.json();
}

async function fetchNameFromLink(link) {
    let result = await fetch(link);
    return (await result.json()).name;
}

function EntityCell({ keyName, value }) {
    const [name, setName] = useState("");

    useEffect(() => {
        fetchNameFromLink(value).then(setName);
    }, [value]);

    return (
        <Link to={`/${keyName}s/${encodeURIComponent(value)}`}>
            {name || String(value)}
        </Link>
    );
}

function makeCellContent(key, value) {
    if (["user", "audiobook"].includes(key)) {
        return <EntityCell keyName={key} value={value} />;
    }

    if (key === "url") {
        return (
            <Link to={`/reviews/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link>
        );
    }

    if (key === "index") {
        return (
            <Link to="/reviews">
                {String(value)}
            </Link>
        );
    }

    return String(value);
}

export default GetReviewComponent;