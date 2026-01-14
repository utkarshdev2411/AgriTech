import axios from 'axios';

// Set base URL for production readiness
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // CRITICAL: This allows cookies to be sent/received
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging (optional, can remove in production)
axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling (optional)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.log('Unauthorized access - redirect to login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
