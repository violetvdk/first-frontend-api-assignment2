import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function GetReviewComponents() {
    const [reviews, setReviews] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        fetchReviews().then((links) => {
            fetchJSONSfromReviews(links).then((reviewList) => {
                setReviews(reviewList);
            });
        });
    }, []);

    function handleDeletedReview(payload) {
        setDeleteError("");
        setReviews((previous) => previous.filter((review) => review.url !== payload.url));
    }

    function handleDeleteError(message) {
        setDeleteError(message);
    }

    return (
        <>
            {deleteError && <p className="post-message post-error resource-feedback">{deleteError}</p>}
            <div className="resource-list">
                {reviews.map((review) => (
                    <div className="resource-card resource-card-row" key={review.url}>
                        <Link className="resource-link" to={`/reviews/${encodeURIComponent(review.url)}`}>
                            {review.url}
                        </Link>
                        <DeleteButton
                            resourceUrl={review.url}
                            requestInfo={buildDeleteRequestInfo()}
                            payloadInfo={{ url: review.url, type: "review" }}
                            onDeleted={handleDeletedReview}
                            onError={handleDeleteError}
                        />
                    </div>
                ))}
            </div>
            <div className="post-button">
                <button className="post-btn post-btn-primary" onClick={() => setIsPostOpen(true)}>Post</button>
                {isPostOpen && (
                    <PostScreen category="reviews" onClose={() => setIsPostOpen(false)} />
                )}
            </div>
        </>
    );
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