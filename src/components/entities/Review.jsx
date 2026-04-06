import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function GetReviewComponent() {
    const {url} = useParams();
    const [review, setReview] = useState([]);
    useEffect(() => {
        const link = decodeURIComponent(url);
        fetchJSONfromReview(link).then(setReview);
    }, [url]);
    return <div>{makeReviewComponent(review)}</div>;
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

function makeReviewComponent(review) {
    return Object.entries(review).map(([key, value]) => makeItem(key, value));
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
            <div key={key}><span>{key}: </span><Link to={`/reviews/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link></div>
        )
    }
    else if (key === "index") {
        return (
            <div key={key}><span>{key}: </span><Link to={`/reviews`}>
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

export default GetReviewComponent;