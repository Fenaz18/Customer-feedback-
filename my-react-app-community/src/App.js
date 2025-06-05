import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminAuth from './components/AdminAuth';
import FeedbackForm from './components/FeedbackForm';
import AggregateRating from './components/AggregateRating';
import FeedbackList from './components/FeedbackList';
import './App.css'; // Import your CSS

const API_BASE_URL = 'http://localhost:8080/api'; // Your Spring Boot API URL

function App() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);

    // Function to check admin status based on token in localStorage
    const checkAdminStatus = () => {
        const token = localStorage.getItem('authToken');
        setIsAdmin(!!token); // Set isAdmin to true if token exists, false otherwise
    };

    // Load feedback from API
    const loadFeedback = async () => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = `Basic ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'GET',
                headers: headers
            });

            if (response.ok) {
                const data = await response.json();
                setFeedbackList(data);
            } else if (response.status === 401 || response.status === 403) {
                // If public /feedback is not allowed (e.g., only admin can view all),
                // and user is not admin, clear list.
                // In current backend, /api/feedback is admin-only.
                // So if not admin, this will fail and list will be empty.
                console.warn('Unauthorized to fetch all feedback, displaying empty list.');
                setFeedbackList([]);
            } else {
                console.error('Failed to load feedback:', response.status, response.statusText);
                setFeedbackList([]); // Clear list on error
            }
        } catch (error) {
            console.error('Network error loading feedback:', error);
            setFeedbackList([]); // Clear list on network error
        }
    };

    // Calculate and display average rating
    const calculateAndDisplayAggregateRating = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/feedback/average-rating`);
            if (response.ok) {
                const avg = await response.json();
                setAverageRating(avg);
            } else {
                setAverageRating(null); // Set to null on error
                console.error('Failed to load average rating:', response.status, response.statusText);
            }
        } catch (error) {
            setAverageRating(null); // Set to null on network error
            console.error('Network error loading average rating:', error);
        }
    };

    // Handle edit button click from FeedbackItem
    const handleEdit = async (id) => {
        if (!isAdmin) {
            alert('You must be logged in as an admin to edit feedback.'); // Simple alert for now
            return;
        }
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const feedbackToEdit = await response.json();
                setEditingFeedback(feedbackToEdit);
                // Scroll to form after setting edit state
                document.getElementById('feedback-form-section').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Failed to fetch feedback for editing.');
            }
        } catch (error) {
            console.error('Error fetching feedback for edit:', error);
            alert('Network error while trying to fetch feedback for edit.');
        }
    };

    // Handle delete button click from FeedbackItem
    const handleDelete = async (id) => {
        if (!isAdmin) {
            alert('You must be logged in as an admin to delete feedback.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok || response.status === 204) {
                loadFeedback(); // Reload feedback list
                calculateAndDisplayAggregateRating(); // Recalculate average
                alert('Feedback deleted successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to delete feedback: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
            alert('Network error during delete.');
        }
    };

    // Initial load on component mount
    useEffect(() => {
        checkAdminStatus(); // Check admin status on load
        loadFeedback();
        calculateAndDisplayAggregateRating();
    }, []);

    // Re-load feedback and average rating when isAdmin status changes
    useEffect(() => {
        loadFeedback();
        calculateAndDisplayAggregateRating();
    }, [isAdmin]);


    return (
        <>
            <Header />
            <main>
                <AdminAuth
                    isAdmin={isAdmin}
                    setAdminStatus={setIsAdmin}
                    loadFeedback={loadFeedback}
                    calculateAndDisplayAggregateRating={calculateAndDisplayAggregateRating}
                />
                <FeedbackForm
                    editingFeedback={editingFeedback}
                    setEditingFeedback={setEditingFeedback}
                    loadFeedback={loadFeedback}
                    calculateAndDisplayAggregateRating={calculateAndDisplayAggregateRating}
                    isAdmin={isAdmin}
                />
                <AggregateRating averageRating={averageRating} />
                <FeedbackList
                    feedbackList={feedbackList}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>
            <Footer />
        </>
    );
}

export default App;