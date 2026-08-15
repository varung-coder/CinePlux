import React, { useState } from 'react';

const AddMediaModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Movie');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required.');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({ title: title.trim(), type, status: 'Unwatched', rating: null });
            setTitle('');
            setType('Movie');
            onClose();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.title) {
                setError(err.response.data.title[0]);
            } else {
                setError('Failed to add item. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Add New Media</h3>
                    <button className="modal-close-btn" onClick={onClose} disabled={submitting}>&times;</button>
                </div>
                
                {error && <div className="modal-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="modal-title">Title</label>
                        <input
                            type="text"
                            id="modal-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter movie or show title"
                            disabled={submitting}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="modal-type">Type</label>
                        <select
                            id="modal-type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            disabled={submitting}
                        >
                            <option value="Movie">Movie</option>
                            <option value="TV">TV Show</option>
                        </select>
                    </div>

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
                            {submitting ? 'Adding...' : 'Add Media'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMediaModal;
