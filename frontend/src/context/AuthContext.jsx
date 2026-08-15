import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance, { registerLogoutCallback } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        setUser(null);
    };

    // Check localStorage for session on initialization
    useEffect(() => {
        const storedUser = localStorage.getItem('username');
        const token = localStorage.getItem('accessToken');
        if (storedUser && token) {
            setUser({ username: storedUser });
        }
        setLoading(false);

        // Connect Axios interceptor logout to this context
        registerLogoutCallback(() => {
            handleLogout();
        });
    }, []);

    const handleLogin = async (username, password) => {
        const response = await axiosInstance.post('/api/token/', {
            username,
            password,
        });
        const { access, refresh } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('username', username);
        setUser({ username });
        return response.data;
    };

    const value = {
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
