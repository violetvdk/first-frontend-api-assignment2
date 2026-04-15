import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";

function GetGenreComponents() {
    const pageAmount = 100;
    const [genres, setGenres] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);

    useEffect(() => {
        fetchGenresPage(min, max).then((links) => {
            fetchJSONSfromGenres(links).then((genres) => {
                setGenres(genres.map((genre) => (
                    <div className="resource-card" key={genre.url}>
                        <Link className="resource-link" to={`/genres/${encodeURIComponent(genre.url)}`}>
                            {genre.url}
                        </Link>
                    </div>
                )));
            });
        });
    }, [min, max]);

    return (
        <>
            <div className="resource-list">
                {genres}
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
                        const length = await fetchGenresLength();
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
                        category="genres"
                        onClose={() => setIsPostOpen(false)}
                    />
                )}
            </div>
        </>
    );
}

async function fetchGenresPage(min, max) {
    const index = await fetchIndex();
    const result = await fetch(index["genres"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genres failed with status ' + response.status);
        }
    });
    const data = await result.json();
    return data.genres.slice(min, max);
}

async function fetchGenresLength() {
    const index = await fetchIndex();
    const result = await fetch(index["genres"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genres failed with status ' + response.status);
        }
    });
    return (await result.json())["genres"].length;
}

async function fetchJSONSfromGenres(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromGenre(link));
    }
    return list;
}

async function fetchJSONfromGenre(link) {
    const result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genre details failed with status ' + response.status);
        }
    });
    return await result.json();
}

export default GetGenreComponents;