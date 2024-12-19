import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure you are using the correct import for React 18+
// Import your CSS file for global styles
import './index.css';
// Import your App component, which is the root component of your app
import App from './App';
// Import the reportWebVitals function for measuring performance (optional)
import reportWebVitals from './reportWebVitals';

// Create the root element for React 18+ using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in React.StrictMode (for development purposes)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
