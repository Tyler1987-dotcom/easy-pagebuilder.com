// src/config.js
const config = {
  stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY, // Stripe key from .env
  apiBaseURL: process.env.REACT_APP_API_BASE_URL || 'https://easy-pagebuilder-com-server.onrender.com', // Fallback to Render backend URL in production
};

if (!config.stripePublishableKey) {
  console.error('Missing Stripe Publishable Key in environment variables.');
  alert('Stripe Publishable Key is missing! Please configure your environment.');
}

export default config;
