import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";
import DeleteButton from "../entities/DeleteButton.jsx";
import { buildDeleteRequestInfo } from "../../data/apiConfig.jsx";

function GetReviewComponents() {
    const pageAmount = 100;
    const [reviews, setReviews] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);
    const [deleteError, setDeleteError] = useState("");
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const links = await fetchReviewsPage(min, max);
                const items = await fetchJSONSfromReviews(links);
                if (!ignore) {
                    setReviews(items);
                }
            } catch (err) {
                console.error(err);
            }
        }
        void load();
        return () => {
            ignore = true;
        };
    }, [min, max]);

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
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({...review, mode: "PUT"})}
                        >
                            PUT
                        </button>
                        <button
                            className="post-btn post-btn-secondary"
                            onClick={() => setEditing({ ...review, mode: "PATCH" })}
                        >
                            PATCH
                        </button>
                    </div>
                ))}
            </div>
            <div className="post-button">
                <button className="post-btn post-btn-primary" onClick={() => setEditing({ mode: "POST" })}>POST</button>
                {editing && (
                    <PostScreen
                        category="reviews"
                        mode={editing?.mode || "POST"}
                        initialData={editing.mode === "POST" ? null : editing}
                        onClose={() => setEditing(null)}
                        onSuccess={() => {
                            setEditing(null);
                            fetchReviewsPage(min, max).then((links) => {
                                fetchJSONSfromReviews(links).then(setReviews);
                            });
                        }}
                    />
                )}
            </div>
            <button
                className="previousPage"
                onClick={() => {
                    setMin((prev) => Math.max(prev - pageAmount, 0));
                    setMax((prev) => Math.max(prev - pageAmount, pageAmount));
                }}
            >
                Previous
            </button>
            <button
                className="nextPage"
                onClick={async () => {
                    const length = await fetchReviewsLength();

                    setMin((prevMin) => {
                        const nextMin = prevMin + pageAmount;
                        if (nextMin < length) {
                            setMax(nextMin + pageAmount);
                            return nextMin;
                        }

                        return prevMin;
                    });
                }}
            >
                Next
            </button>
        </>
    );
}

async function fetchReviewsPage(min, max) {
    const index = await fetchIndex();
    const result = await fetch(index["reviews"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for reviews failed with status ' + response.status);
        }
    });
    const data = await result.json();
    return data.reviews.slice(min, max);
}

async function fetchReviewsLength() {
    const index = await fetchIndex();
    const result = await fetch(index["reviews"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for reviews failed with status ' + response.status);
        }
    });
    return (await result.json())["reviews"].length;
}

async function fetchJSONSfromReviews(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromReview(link));
    }
    return list;
}

async function fetchJSONfromReview(link) {
    const result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for review details failed with status ' + response.status);
        }
    });
    const data = await result.json();
    const etag = result.headers.get("ETag");
    return {...data, etag};
}

export default GetReviewComponents;