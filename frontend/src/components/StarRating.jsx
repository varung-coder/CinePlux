import React, { useState } from 'react';

const StarRating = ({ rating, onChange, disabled = false }) => {
    const [hover, setHover] = useState(null);

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;

                return (
                    <button
                        type="button"
                        key={ratingValue}
                        className={`star-btn ${disabled ? 'disabled' : ''}`}
                        onClick={() => {
                            if (!disabled && onChange) {
                                onChange(ratingValue);
                            }
                        }}
                        onMouseEnter={() => {
                            if (!disabled) {
                                setHover(ratingValue);
                            }
                        }}
                        onMouseLeave={() => {
                            if (!disabled) {
                                setHover(null);
                            }
                        }}
                        disabled={disabled}
                        aria-label={`Rate ${ratingValue} out of 5 stars`}
                    >
                        <span className={`star ${ratingValue <= (hover || rating) ? 'filled' : 'empty'}`}>
                            ★
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
