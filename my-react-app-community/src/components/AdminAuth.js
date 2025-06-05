import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api'; // Your Spring Boot API URL

function AdminAuth({ isAdmin, setAdminStatus, loadFeedback, calculateAndDisplayAggregateRating }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loggedInUsername, setLoggedInUsername] = useState('');

    useEffect(() => {
        // Set logged in username from local storage on initial render
        const storedUsername = localStorage.getItem('adminUsername');
        if (storedUsername) {
            setLoggedInUsername(storedUsername);
        }
    }, [isAdmin]); // Update if isAdmin changes

    const getAuthToken = () => localStorage.getItem('authToken');
    const setAuthToken = (token) => localStorage.setItem('authToken', token);
    const removeAuthToken = () => localStorage.removeItem('authToken');
    const setAdminUsername = (user) => localStorage.setItem('adminUsername', user);
    const removeAdminUsername = () => localStorage.removeItem('adminUsername');

    const handleAdminLogin = async (event) => {
        event.preventDefault();
        setLoginError('');

        const token = btoa(`${username}:${password}`); // Basic Base64 encoding

        try {
            const response = await fetch(`${API_BASE_URL}/feedback`, { // Use a protected endpoint to test
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setAuthToken(token);
                setAdminUsername(username);
                setAdminStatus(true); // Update parent state
                setLoggedInUsername(username);
                setUsername('');
                setPassword('');
                loadFeedback(); // Reload feedback to show admin options
                calculateAndDisplayAggregateRating(); // Recalculate if needed
            } else if (response.status === 401 || response.status === 403) {
                setLoginError('Invalid username or password.');
                setAdminStatus(false);
            } else {
                setLoginError(`Login failed: ${response.status} ${response.statusText || 'Unknown error'}`);
                setAdminStatus(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('Could not connect to server for login. Check backend.');
            setAdminStatus(false);
        }
    };

    const handleAdminLogout = () => {
        removeAuthToken();
        removeAdminUsername();
        setAdminStatus(false); // Update parent state
        setLoggedInUsername('');
        loadFeedback(); // Reload feedback to hide admin options
        calculateAndDisplayAggregateRating(); // Recalculate if needed
    };

    return (
        <section id="admin-auth-section" className="card">
            <h2>Admin Access</h2>
            <div id="auth-status" style={{ display: isAdmin ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center' }}>
                <span id="loggedInUser" style={{ display: 'inline' }}>Logged in as: <strong id="usernameDisplay">{loggedInUsername}</strong></span>
                <button id="logoutButton" className="button-secondary" onClick={handleAdminLogout} style={{ display: 'inline', marginLeft: '10px' }}>Logout</button>
            </div>
            <form id="adminLoginForm" className="auth-form" onSubmit={handleAdminLogin} style={{ display: isAdmin ? 'none' : 'block' }}>
                <div className="form-group">
                    <label htmlFor="adminUsername">Username:</label>
                    <input
                        type="text"
                        id="adminUsername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="adminPassword">Password:</label>
                    <input
                        type="password"
                        id="adminPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="button-primary">Login as Admin</button>
                {loginError && <div id="loginError" className="error-message">{loginError}</div>}
            </form>
        </section>
    );
}

export default AdminAuth;