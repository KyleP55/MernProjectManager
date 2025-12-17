import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthContext";
import "../css/Header.css";

export default function Header() {
    const nav = useNavigate();
    const { user, loading, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (<>
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">Project Manager</h1>
            </div>
            <div className="header-right">
                {!loading ? (
                    <>
                        {user &&
                            <>
                                <div className="user-info">
                                    <p className="user-name">{user.name}</p>
                                    <p className="user-role">{user.role}</p>
                                </div>
                                <button onClick={() => nav('/features')} className="blue-btn">
                                    Features
                                </button>
                                <button onClick={handleLogout} className="logout-btn">
                                    Sign Out
                                </button>
                            </>
                        }
                        {!user && <button onClick={() => nav('/features')} className="blue-btn">
                            Features
                        </button>}
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
