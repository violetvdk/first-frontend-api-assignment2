import fetchIndex from "../../data/index.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function GetGenreComponents() {
    const [genres, setGenres] = useState([]);
    useEffect(() => {
        fetchGenres().then((links) => {
            fetchJSONSfromGenres(links).then((genres) => {
                setGenres(genres.map((genre) => (<div key={genre.url}><Link to={`/genres/${encodeURIComponent(genre.url)}`}>
                    {genre.url}
                </Link></div>)));
            });
        });
    }, []);
    return (<>{genres}</>);
}

async function fetchGenres() {
    let index = await fetchIndex();
    let result = await fetch(index["genres"]).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genres failed with status ' + response.status);
        }
    });
    return (await result.json())["genres"];
}

async function fetchJSONSfromGenres(links) {
    const list = [];
    for (const link of links) {
        list.push(await fetchJSONfromGenre(link));
    }
    return list;
}

async function fetchJSONfromGenre(link) {
    let result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for genre details failed with status ' + response.status);
        }
    });
    return await result.json();
}

export default GetGenreComponents;