import fetchIndex from "../../index.js";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function GetReviewComponents() {
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        fetchReviews().then((links) => {
            fetchJSONSfromReviews(links).then((reviews) => {
                setReviews(reviews.map((review) => (<div key={review.url}><Link to={`/reviews/${encodeURIComponent(review.url)}`}>
                    {review.url}
                </Link></div>)));
            });
        });
    }, []);
    return (<>
        <div key="index"><span>index: </span><Link to={`/home`}>{`/home`}</Link></div>
        <div>{String("reviews: ")}</div>
        {reviews}</>);  // de /home moet nog veranderd worden naar de echte home-url
}

async function fetchReviews() {
    let index = await fetchIndex();
    let result = await fetch(index["reviews"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for reviews failed with status ' + response.status);
        }
    });
    return (await result.json())["reviews"];
}

async function fetchJSONSfromReviews(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromReview(link));
    }
    return list;
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

export default GetReviewComponents;