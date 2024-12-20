const config = {
  stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY, // Stripe key from .env
  apiBaseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000', // Fallback to Render backend URL in production
};

// Check if the Stripe Publishable Key is missing
if (!config.stripePublishableKey) {
  console.error('Missing Stripe Publishable Key in environment variables.');
  alert('Stripe Publishable Key is missing! Please configure your environment.');
}

// Check if the API Base URL is missing or incorrect
if (!config.apiBaseURL) {
  console.error('API Base URL is missing or invalid in environment variables.');
  alert('API Base URL is missing or invalid! Please configure your environment.');
}

export default config;
