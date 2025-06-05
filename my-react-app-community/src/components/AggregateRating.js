import React from 'react';

function AggregateRating({ averageRating }) {
    return (
        <section id="aggregate-rating-section" className="card">
            <h2>Overall Customer Satisfaction</h2>
            <p>Average Rating: <span id="averageRatingDisplay">{averageRating !== null ? averageRating.toFixed(1) : 'N/A'}</span> <i className="fas fa-star gold-star"></i></p>
        </section>
    );
}

export default AggregateRating;