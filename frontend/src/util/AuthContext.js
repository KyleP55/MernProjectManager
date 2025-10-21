// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const refresh = async () => {
        try {
            const exists = document.cookie.includes('loggedin=true');
            if (!exists) {
                setLoading(false);
                setIsAuthenticated(false);
                return;
            }

            await axios.get(`${BACKEND_URL}/auth/refresh`, { withCredentials: true });
            const res = await axios.get(`${BACKEND_URL}/auth/profile`, { withCredentials: true });
            setUser(res.data.user);
            setIsAuthenticated(true);
        } catch {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, refresh, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
