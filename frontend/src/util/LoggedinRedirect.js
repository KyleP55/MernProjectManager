import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function LoggedinRedirect({ children }) {
    const [isAuth, setIsAuth] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            const exists = document.cookie.includes('loggedin=true');
            if (!exists) {
                setIsAuth(false);
                return;
            }
            nav('/hub');
        }

        checkAuth();
    }, [nav]);

    if (isAuth === null) return <p>Loading...</p>;

    return isAuth ? null : children;
}

export default LoggedinRedirect;