import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import fetchIndex from "../../data/index.jsx";

function GetHome() {
    const [home, setHome] = useState([]);

    useEffect(() => {
        fetchIndex().then((index) => {
            setHome(Object.keys(index).map((key) => (
                <div className="resource-card" key={key}>
                    <span className="resource-label">{key}: </span>
                    <Link className="resource-link" to={`/${key}`}>
                        {index[key]}
                    </Link>
                </div>
            )));
        });
    }, []);

    return <div className="resource-list">{home}</div>;
}

export default GetHome;