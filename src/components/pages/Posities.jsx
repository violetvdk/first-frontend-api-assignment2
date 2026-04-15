import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import PostScreen from "../pop-ups/post/PostScreen.jsx";

function GetPositionComponents() {
    const pageAmount = 100;
    const [positions, setPositions] = useState([]);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(pageAmount);

    useEffect(() => {
        fetchPositionsPage(min, max).then((links) => {
            fetchJSONSfromPositions(links).then((positions) => {
                setPositions(positions.map((position) => (
                    <div className="resource-card" key={position.url}>
                        <Link className="resource-link" to={`/positions/${encodeURIComponent(position.url)}`}>
                            {position.url}
                        </Link>
                    </div>
                )));
            });
        });
    }, [min, max]);

    return (
        <>
            <div className="resource-list">
                {positions}
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
                        const length = await fetchPositionsLength();

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
                        category="positions"
                        onClose={() => setIsPostOpen(false)}
                    />
                )}
            </div>
        </>
    );
}

async function fetchPositionsPage(min, max) {
    const index = await fetchIndex();
    const result = await fetch(index["positions"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for positions failed with status ' + response.status);
        }
    });
    const data = await result.json();
    return data.positions.slice(min, max);
}

async function fetchPositionsLength() {
    const index = await fetchIndex();
    const result = await fetch(index["positions"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for positions failed with status ' + response.status);
        }
    });
    return (await result.json())["positions"].length;
}

async function fetchJSONSfromPositions(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromPosition(link));
    }
    return list;
}

async function fetchJSONfromPosition(link) {
    const result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for position details failed with status ' + response.status);
        }
    });
    return await result.json();
}

export default GetPositionComponents;