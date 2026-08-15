import React from 'react';
import StarRating from './StarRating';

const MediaCard = ({ item, onMarkWatched, onEdit, onDelete, onRate }) => {
    const isWatched = item.status === 'Watched';

    return (
        <div className={`media-card ${isWatched ? 'media-watched' : 'media-unwatched'}`}>
            <div className="media-card-header">
                <span className={`media-type-badge ${item.type.toLowerCase()}`}>
                    {item.type === 'Movie' ? '🎬 Movie' : '📺 TV Show'}
                </span>
                <span className={`media-status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                </span>
            </div>
            
            <h3 className="media-card-title">{item.title}</h3>

            <div className="media-card-body">
                {isWatched && (
                    <div className="rating-section">
                        <span className="rating-label">Your Rating:</span>
                        <StarRating 
                            rating={item.rating} 
                            onChange={(newRating) => onRate(item.id, newRating)}
                        />
                    </div>
                )}
            </div>

            <div className="media-card-actions">
                {!isWatched && (
                    <button 
                        className="btn btn-primary btn-sm action-btn" 
                        onClick={() => onMarkWatched(item.id)}
                    >
                        ✓ Watched
                    </button>
                )}
                <button 
                    className="btn btn-outline btn-sm action-btn" 
                    onClick={() => onEdit(item)}
                >
                    Edit
                </button>
                <button 
                    className="btn btn-danger btn-sm action-btn" 
                    onClick={() => onDelete(item.id, item.title)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default MediaCard;
