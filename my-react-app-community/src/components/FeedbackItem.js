import React from 'react';

function FeedbackItem({ feedback, isAdmin, onEdit, onDelete }) {
    const customerName = feedback.customerName || 'Anonymous';
    const submissionDate = new Date(feedback.submissionDate).toLocaleString();

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className={i <= feedback.rating ? 'fas fa-star' : 'far fa-star'}></i>
            );
        }
        return stars;
    };

    return (
        <div className="feedback-item">
            <h3>{customerName}</h3>
            <div className="rating-display">{renderStars()}</div>
            <p>{feedback.comments}</p>
            <p className="submission-date">Submitted on: {submissionDate}</p>
            {isAdmin && (
                <div className="actions">
                    <button className="button-secondary edit-btn" onClick={() => onEdit(feedback.id)}>Edit</button>
                    <button className="button-danger delete-btn" onClick={() => onDelete(feedback.id)}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default FeedbackItem;