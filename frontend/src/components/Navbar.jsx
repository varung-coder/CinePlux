import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <span className="logo-icon">🎬</span>
                    <span className="logo-text">CinePlux</span>
                </div>
                {user && (
                    <div className="navbar-user">
                        <span className="user-greeting">Welcome, <strong>{user.username}</strong></span>
                        <button className="btn btn-outline btn-sm logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
