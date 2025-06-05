import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api'; // Your Spring Boot API URL

function FeedbackForm({
    editingFeedback,
    setEditingFeedback,
    loadFeedback,
    calculateAndDisplayAggregateRating,
    isAdmin
}) {
    const [feedbackId, setFeedbackId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [currentRating, setCurrentRating] = useState(0);
    const [comments, setComments] = useState('');

    const [emailError, setEmailError] = useState('');
    const [ratingError, setRatingError] = useState('');
    const [commentsError, setCommentsError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (editingFeedback) {
            setFeedbackId(editingFeedback.id);
            setCustomerName(editingFeedback.customerName || '');
            setCustomerEmail(editingFeedback.email || '');
            setCurrentRating(editingFeedback.rating);
            setComments(editingFeedback.comments);
        } else {
            clearForm();
        }
    }, [editingFeedback]);

    const validateForm = () => {
        let isValid = true;
        setEmailError('');
        setRatingError('');
        setCommentsError('');
        setFormError('');
        setFormSuccess('');

        if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        }

        if (currentRating === 0) {
            setRatingError('Please select a rating.');
            isValid = false;
        }

        if (comments.trim() === '') {
            setCommentsError('Comments cannot be empty.');
            isValid = false;
        } else if (comments.trim().length < 10 || comments.trim().length > 1000) {
            setCommentsError('Comments must be between 10 and 1000 characters.');
            isValid = false;
        }

        return isValid;
    };

    const clearForm = () => {
        setFeedbackId('');
        setCustomerName('');
        setCustomerEmail('');
        setCurrentRating(0);
        setComments('');
        setEmailError('');
        setRatingError('');
        setCommentsError('');
        setFormSuccess('');
        setFormError('');
        setEditingFeedback(null); // Clear editing state in parent
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            setFormError('Please correct the errors in the form.');
            return;
        }

        setFormError('');
        setFormSuccess('Submitting feedback...');

        const method = feedbackId ? 'PUT' : 'POST';
        const url = feedbackId ? `${API_BASE_URL}/feedback/${feedbackId}` : `${API_BASE_URL}/feedback`;

        const feedbackData = {
            customerName: customerName || null,
            email: customerEmail || null,
            rating: currentRating,
            comments: comments.trim()
        };

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (method === 'PUT') {
                if (!isAdmin) {
                    setFormError('You must be logged in as an admin to edit feedback.');
                    setFormSuccess('');
                    return;
                }
                const authToken = localStorage.getItem('authToken');
                if (authToken) {
                    headers['Authorization'] = `Basic ${authToken}`;
                }
            }

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                setFormSuccess(feedbackId ? 'Feedback updated successfully!' : 'Feedback submitted successfully!');
                clearForm();
                loadFeedback();
                calculateAndDisplayAggregateRating();
            } else {
                const errorData = await response.json();
                let errorMessage = `Error: ${response.status} ${response.statusText}`;
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && errorData.errors && errorData.errors.length > 0) {
                    errorMessage = errorData.errors.map(err => err.defaultMessage).join(', ');
                }
                setFormError(errorMessage);
                setFormSuccess('');
            }
        } catch (error) {
            console.error('Network or server error:', error);
            setFormError('Could not connect to the server. Please try again.');
            setFormSuccess('');
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={i <= currentRating ? 'fas fa-star' : 'far fa-star'}
                    data-rating={i}
                    onClick={() => setCurrentRating(i)}
                ></i>
            );
        }
        return stars;
    };

    return (
        <section id="feedback-form-section" className="card">
            <h2 id="formTitle">{editingFeedback ? 'Edit Feedback' : 'Submit Your Feedback'}</h2>
            <form id="feedbackForm" onSubmit={handleSubmit}>
                <input type="hidden" id="feedbackId" value={feedbackId} />

                <div className="form-group">
                    <label htmlFor="customerName">Your Name:</label>
                    <input
                        type="text"
                        id="customerName"
                        placeholder="Optional"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customerEmail">Your Email:</label>
                    <input
                        type="email"
                        id="customerEmail"
                        placeholder="Optional"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                    {emailError && <span id="emailError" className="error-message">{emailError}</span>}
                </div>

                <div className="form-group">
                    <label>Rating:</label>
                    <div id="starRating" className="star-rating">
                        {renderStars()}
                    </div>
                    {ratingError && <span id="ratingError" className="error-message">{ratingError}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="comments">Comments/Suggestions:</label>
                    <textarea
                        id="comments"
                        rows="5"
                        placeholder="Tell us what you think..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        required
                    ></textarea>
                    {commentsError && <span id="commentsError" className="error-message">{commentsError}</span>}
                </div>

                <button type="submit" className="button-primary">
                    {editingFeedback ? 'Update Feedback' : 'Submit Feedback'}
                </button>
                {editingFeedback && (
                    <button type="button" id="cancelEditButton" className="button-secondary" onClick={clearForm}>
                        Cancel Edit
                    </button>
                )}
                {formSuccess && <div id="formSuccess" className="success-message">{formSuccess}</div>}
                {formError && <div id="formError" className="error-message">{formError}</div>}
            </form>
        </section>
    );
}

export default FeedbackForm;