import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import Navbar from '../components/Navbar';
import MediaCard from '../components/MediaCard';
import AddMediaModal from '../components/AddMediaModal';
import EditMediaModal from '../components/EditMediaModal';

const Dashboard = () => {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Tab and search state
    const [activeTab, setActiveTab] = useState('To Watch'); // 'To Watch' or 'Watched'
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchMedia = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axiosInstance.get('/api/media/');
            setMediaItems(response.data);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    // Create item
    const handleAddMedia = async (newItemData) => {
        const response = await axiosInstance.post('/api/media/', newItemData);
        setMediaItems((prev) => [response.data, ...prev]);
    };

    // Quick Action: Mark as Watched
    const handleMarkWatched = async (id) => {
        try {
            const response = await axiosInstance.patch(`/api/media/${id}/`, {
                status: 'Watched'
            });
            // Update local state
            setMediaItems((prev) =>
                prev.map((item) => (item.id === id ? response.data : item))
            );
        } catch (err) {
            console.error(err);
            alert('Failed to update status. Please try again.');
        }
    };

    // Update rating
    const handleRateMedia = async (id, rating) => {
        try {
            const response = await axiosInstance.patch(`/api/media/${id}/`, {
                rating
            });
            // Update local state
            setMediaItems((prev) =>
                prev.map((item) => (item.id === id ? response.data : item))
            );
        } catch (err) {
            console.error(err);
            alert('Failed to update rating. Please try again.');
        }
    };

    // Complete edit update
    const handleUpdateMedia = async (id, updatedFields) => {
        const response = await axiosInstance.put(`/api/media/${id}/`, updatedFields);
        setMediaItems((prev) =>
            prev.map((item) => (item.id === id ? response.data : item))
        );
    };

    // Delete item
    const handleDeleteMedia = async (id, title) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (!confirmDelete) return;

        try {
            await axiosInstance.delete(`/api/media/${id}/`);
            setMediaItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete the item. Please try again.');
        }
    };

    // Filter list based on current tab and search
    const filteredItems = mediaItems.filter((item) => {
        const matchesTab = activeTab === 'To Watch' 
            ? item.status === 'Unwatched' 
            : item.status === 'Watched';
        
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const unwatchedCount = mediaItems.filter((item) => item.status === 'Unwatched').length;
    const watchedCount = mediaItems.filter((item) => item.status === 'Watched').length;

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-container">
                {/* Header section */}
                <div className="dashboard-header">
                    <div>
                        <h1>CinePlux Watchlist</h1>
                        <p className="subtitle">Keep track of movies and series you love or want to watch.</p>
                    </div>
                    <button 
                        className="btn btn-primary add-media-btn"
                        onClick={() => setIsAddOpen(true)}
                    >
                        <span className="btn-icon">+</span> Add Movie / Show
                    </button>
                </div>

                {/* Search & Tabs control bar */}
                <div className="control-bar">
                    <div className="tabs-container">
                        <button
                            className={`tab-btn ${activeTab === 'To Watch' ? 'active' : ''}`}
                            onClick={() => setActiveTab('To Watch')}
                        >
                            To Watch <span className="tab-count">{unwatchedCount}</span>
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'Watched' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Watched')}
                        >
                            Watched <span className="tab-count">{watchedCount}</span>
                        </button>
                    </div>

                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by title or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                                &times;
                            </button>
                        )}
                    </div>
                </div>

                {/* Main display area */}
                {loading ? (
                    <div className="state-container loading">
                        <div className="spinner"></div>
                        <p>Loading your watchlist...</p>
                    </div>
                ) : error ? (
                    <div className="state-container error">
                        <p className="error-message">{error}</p>
                        <button className="btn btn-outline" onClick={fetchMedia}>Try Again</button>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="state-container empty">
                        <span className="empty-icon">
                            {activeTab === 'To Watch' ? '🍿' : '⭐'}
                        </span>
                        {searchTerm ? (
                            <p>No matches found for "{searchTerm}".</p>
                        ) : activeTab === 'To Watch' ? (
                            <>
                                <p>Your watchlist is empty.</p>
                                <p className="empty-subtext">Add a movie or show to get started.</p>
                            </>
                        ) : (
                            <>
                                <p>You haven't watched anything yet.</p>
                                <p className="empty-subtext">Mark items in your watchlist as watched to see them here.</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="media-grid">
                        {filteredItems.map((item) => (
                            <MediaCard
                                key={item.id}
                                item={item}
                                onMarkWatched={handleMarkWatched}
                                onEdit={setEditingItem}
                                onDelete={handleDeleteMedia}
                                onRate={handleRateMedia}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Overlays */}
            <AddMediaModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSubmit={handleAddMedia}
            />

            <EditMediaModal
                isOpen={!!editingItem}
                item={editingItem}
                onClose={() => setEditingItem(null)}
                onSubmit={handleUpdateMedia}
            />
        </div>
    );
};

export default Dashboard;
