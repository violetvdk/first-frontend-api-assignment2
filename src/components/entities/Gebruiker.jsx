import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function GetUserComponent() {
    const {url} = useParams();
    const [user, setUser] = useState({});

    useEffect(() => {
        const link = decodeURIComponent(url);
        fetchJSONfromUser(link).then(setUser);
    }, [url]);

    return (
        <div className="entity-table-wrapper">
            <table className="entity-table">
                <tbody>
                {Object.entries(user).map(([key, value]) => (
                    <tr key={key}>
                        <th>{key}</th>
                        <td>{makeCellContent(key, value)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
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

function makeCellContent(key, value) {
    if (["reviews", "positions"].includes(key)) {
        return value.map((v) => (
            <div key={`${key}-${v}`}>
                <Link to={`/${key}/${encodeURIComponent(v)}`}>
                    {String(v)}
                </Link>
            </div>
        ));
    }

    if (key === "url") {
        return (
            <Link to={`/users/${encodeURIComponent(value)}`}>
                {String(value)}
            </Link>
        );
    }

    if (key === "index") {
        return (
            <Link to="/users">
                {String(value)}
            </Link>
        );
    }

    return String(value);
}

export default GetUserComponent;