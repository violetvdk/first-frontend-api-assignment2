import {Link} from "react-router-dom";

function GetNotFoundComponent() {
    return (<>
        <div>{String("Page not found")}</div>
        <div key="index"><span>Return to homepage: </span><Link to={`/home`}>{`/home`}</Link></div>
    </>);  // de /home moet nog veranderd worden naar de echte home-url
}

export default GetNotFoundComponent;