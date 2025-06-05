import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
// No specific CSS import for index.css if App.css is imported in App.jsx

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);