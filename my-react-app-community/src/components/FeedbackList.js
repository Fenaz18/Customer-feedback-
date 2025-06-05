import React from 'react';
import FeedbackItem from './FeedbackItem';

function FeedbackList({ feedbackList, isAdmin, onEdit, onDelete }) {
    return (
        <section id="feedback-list-section" className="card">
            <h2>Recent Customer Feedback</h2>
            <div id="feedbackList">
                {feedbackList.length === 0 ? (
                    <p id="noFeedbackMessage">No feedback submitted yet. Be the first!</p>
                ) : (
                    feedbackList.map(feedback => (
                        <FeedbackItem
                            key={feedback.id}
                            feedback={feedback}
                            isAdmin={isAdmin}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default FeedbackList;