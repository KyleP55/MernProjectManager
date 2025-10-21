import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


function AuthRedirect({ children }) {
    const nav = useNavigate();
    const { isAuthenticated, loading } = useAuth()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            nav('/');
        }
    }, [isAuthenticated, loading, nav]);

    if (loading === true) return <p>Loading...</p>;

    return children;
}

export default AuthRedirect;