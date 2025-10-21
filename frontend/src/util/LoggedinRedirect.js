import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

function LoggedinRedirect({ children }) {
    const nav = useNavigate();
    const { loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            nav("/hub");
        }
    }, [loading, isAuthenticated, nav]);

    if (loading === true) return <p>Loading...</p>;


    return children;
}

export default LoggedinRedirect;