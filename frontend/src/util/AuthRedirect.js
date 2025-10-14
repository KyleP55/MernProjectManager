import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function AuthRedirect({ children }) {
    const [isAuth, setIsAuth] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            try {
                const exists = document.cookie.includes('loggedin=true');
                if (!exists) {
                    setIsAuth(false);
                    await fetch(`${BACKEND_URL}/auth/logout`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include'
                    });
                    return nav('/');
                }

                const refresh = await fetch(`${BACKEND_URL}/auth/refresh`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (!refresh.ok) {
                    setIsAuth(false);
                    return nav("/");
                } else {
                    setIsAuth(true);
                }
            } catch (err) {
                setIsAuth(false);
                nav('/');
            }
        }

        checkAuth();
    }, [nav]);

    if (isAuth === null) return <p>Loading...</p>;

    return isAuth ? children : null;
}

export default AuthRedirect;