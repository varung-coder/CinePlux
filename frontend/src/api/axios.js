import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let logoutCallback = null;

export const registerLogoutCallback = (cb) => {
    logoutCallback = cb;
};

// Request interceptor: Attach JWT token to outgoing requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Catch 401 errors and attempt automatic refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Prevent looping on auth endpoints
            if (
                originalRequest.url === '/api/token/refresh/' || 
                originalRequest.url === '/api/token/' ||
                originalRequest.url === '/api/register/'
            ) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Call token refresh using standard axios client to avoid interceptors
                    const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem('accessToken', newAccessToken);

                    // Retry original request with the new access token
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Refresh token is expired or invalid
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    if (logoutCallback) {
                        logoutCallback();
                    }
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available, log out
                localStorage.removeItem('accessToken');
                if (logoutCallback) {
                    logoutCallback();
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
