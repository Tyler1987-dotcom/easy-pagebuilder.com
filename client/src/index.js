import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure you are using the correct import for React 18+
import './index.css'; // Import your CSS file for global styles
import App from './App'; // Import your App component
import reportWebVitals from './reportWebVitals'; // Import the reportWebVitals function

// Create the root element for React 18+ using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Start measuring performance in your app
reportWebVitals();
