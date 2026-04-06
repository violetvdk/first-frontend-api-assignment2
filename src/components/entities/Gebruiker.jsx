import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function GetUserComponent() {
    const {url} = useParams();
    const [user, setUser] = useState([]);
    useEffect(() => {
        const link = decodeURIComponent(url);
        fetchJSONfromUser(link).then(setUser);
    }, [url]);
    return (<>
        <div key="index"><span>index: </span><Link to={`/users`}>{`/users`}</Link></div>
        <div>{makeUserComponent(user)}</div>
    </>);
}

async function fetchJSONfromUser(link) {
    let result = await fetch(link).then(response => {
        if (response.ok) {
            return response;
        } else {
            throw new Error('API call for user details failed with status ' + response.status);
        }
    });
    return await result.json();
}

function makeUserComponent(user) {
    return Object.entries(user).map(([key, value]) => makeItem(key, value));
}

function makeItem(key, value) {
    if (["reviews", "positions"].includes(key)) {
        return (
            <div key={key}>
                <span>{key}: </span>
                {value.map((v) => (
                    <div key={v}>
                        <Link to={`/${key}/${encodeURIComponent(v)}`}>
                            {String(v)}
                        </Link>
                    </div>
                ))}
            </div>
        );
    }
    else if (key === "url") {
        return (
            <div key={key}><span>{key}: </span><Link to={`/users/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link></div>
        )
    }
    else if (key === "index") {
        return (
            <div key={key}><span>{key}: </span><Link to={`/users`}>
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

export default GetUserComponent;