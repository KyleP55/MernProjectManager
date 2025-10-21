// src/api.js
import axios from "axios";
import { useAuth } from "./AuthContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// Create base instance
const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
});

// Custom hook wrapper to attach interceptors dynamically
export const useApi = () => {
    const { refresh, logout } = useAuth();

    // Add interceptors once
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Prevent infinite loop
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    await refresh(); // refresh tokens using AuthContext
                    return api(originalRequest); // retry original request
                } catch (err) {
                    logout();
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );

    return api;
};
