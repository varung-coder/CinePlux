import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';

const EditMediaModal = ({ isOpen, item, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Movie');
    const [status, setStatus] = useState('Unwatched');
    const [rating, setRating] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (item) {
            setTitle(item.title || '');
            setType(item.type || 'Movie');
            setStatus(item.status || 'Unwatched');
            setRating(item.rating || null);
            setError('');
        }
    }, [item]);

    if (!isOpen || !item) return null;

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'Unwatched') {
            setRating(null); // rating must be null if status is Unwatched
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required.');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(item.id, {
                title: title.trim(),
                type,
                status,
                rating: status === 'Watched' ? rating : null
            });
            onClose();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.title) {
                    setError(data.title[0]);
                } else if (data.rating) {
                    setError(data.rating[0]);
                } else if (data.detail) {
                    setError(data.detail);
                } else {
                    setError('Failed to update media. Please try again.');
                }
            } else {
                setError('Failed to update media. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Edit Media Details</h3>
                    <button className="modal-close-btn" onClick={onClose} disabled={submitting}>&times;</button>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="edit-title">Title</label>
                        <input
                            type="text"
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={submitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-type">Type</label>
                        <select
                            id="edit-type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            disabled={submitting}
                        >
                            <option value="Movie">Movie</option>
                            <option value="TV">TV Show</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-status">Status</label>
                        <select
                            id="edit-status"
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={submitting}
                        >
                            <option value="Unwatched">Unwatched</option>
                            <option value="Watched">Watched</option>
                        </select>
                    </div>

                    {status === 'Watched' && (
                        <div className="form-group">
                            <label>Rating</label>
                            <div style={{ marginTop: '8px' }}>
                                <StarRating
                                    rating={rating}
                                    onChange={setRating}
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMediaModal;
