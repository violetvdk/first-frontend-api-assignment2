import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function GetPositionComponents() {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        fetchPositions().then((links) => {
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
    }, []);

    return <div className="resource-list">{positions}</div>;
}

async function fetchPositions() {
    let index = await fetchIndex();
    let result = await fetch(index["positions"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for positions failed with status ' + response.status);
        }
    });
    return (await result.json())["positions"];
}

async function fetchJSONSfromPositions(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromPosition(link));
    }
    return list;
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

export default GetPositionComponents;