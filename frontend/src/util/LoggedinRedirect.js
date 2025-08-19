import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function LoggedinRedirect({ children }) {
    const [isAuth, setIsAuth] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            try {
                const refresh = await fetch(`${BACKEND_URL}/auth/refresh`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (!refresh.ok) {
                    setIsAuth(false);
                    return;
                }

                const res = await fetch(`${BACKEND_URL}/auth/profile`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (res.ok) {
                    setIsAuth(true);
                    nav('/hub');
                } else {
                    setIsAuth(false);
                }
            } catch (err) {
                setIsAuth(false);
            }
        }

        checkAuth();
    }, [nav]);

    if (isAuth === null) return <p>Loading...</p>;

    return isAuth ? null : children;
}

export default LoggedinRedirect;