import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";

function GetReviewComponents() {
    const pageAmount = 100;
    const [reviews, setReviews] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);

    useEffect(() => {
        fetchReviewsPage(min, max).then((links) => {
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
    }, [min, max]);

    return (
        <>
            <div className="resource-list">
                {reviews}
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
            </div>
            <div className="post-button">
                <button className="myButton" onClick={() => setIsPostOpen(true)}>
                    POST
                </button>

                {isPostOpen && (
                    <PostScreen
                        category="reviews"
                        onClose={() => setIsPostOpen(false)}
                    />
                )}
            </div>
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
    return await result.json();
}

export default GetReviewComponents;