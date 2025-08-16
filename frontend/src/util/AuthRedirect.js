import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function AuthRedirect({ children }) {
    const [isAuth, setIsAuth] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            try {
                const refresh = await fetch(`${BACKEND_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                console.log('a')

                const res = await fetch(`${BACKEND_URL}/auth/profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (res) setIsAuth(true); else setIsAuth(false);
            } catch (err) {
                setIsAuth(false);
                console.log(err.message)
                //nav('/');
            }
        }

        checkAuth();
    }, [nav]);

    if (isAuth === null) return <p>Loading...</p>;

    return isAuth ? children : null;
}

export default AuthRedirect;