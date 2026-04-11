import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import fetchIndex from "../../data/index.jsx";

function GetHome() {
    const [home, setHome] = useState([]);
    useEffect(() => {
        fetchIndex().then((index) => {                                                                  // /${encodeURIComponent(index[key])} als we de originele inhoud willen
            setHome(Object.keys(index).map((key) => (<div key={key}><span>{key}: </span><Link to={`/${key}`}>
                {index[key]}
            </Link></div>)));
        });
    }, []);
    return <>{home}</>;
}

export default GetHome;