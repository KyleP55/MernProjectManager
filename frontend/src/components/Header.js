import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Header.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function Header() {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/auth/profile`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (!res.ok) throw new Error("Not authenticated");
                const data = await res.json();
                setUser(data.user);
                setLoaded(true);
            } catch (err) {
                console.error(err);
                setLoaded(true);
                //nav("/");
            }
        };

        fetchUser();
    }, [nav]);

    const handleLogout = async () => {
        try {
            await fetch(`${BACKEND_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            setLoaded(false);
            nav("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (<>
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">Project Hub</h1>
            </div>
            <div className="header-right">
                {loaded ? (
                    <>
                        {user &&
                            <>
                                <div className="user-info">
                                    <p className="user-name">{user.name}</p>
                                    <p className="user-role">{user.role}</p>
                                </div>
                                <button onClick={handleLogout} className="logout-btn">
                                    Sign Out
                                </button>
                            </>
                        }
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </header>
        <Outlet />
    </>
    );
}
