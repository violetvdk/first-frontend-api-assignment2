import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function GetReviewComponents() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchReviews().then((links) => {
            fetchJSONSfromReviews(links).then((reviews) => {
                setReviews(reviews.map((review) => (
                    <div className="resource-card" key={review.url}>
                        <Link className="resource-link" to={`/reviews/${encodeURIComponent(review.url)}`}>
                            {review.url}
                        </Link>
                    </div>
                )));
            });
        });
    }, []);

    return <div className="resource-list">{reviews}</div>;
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