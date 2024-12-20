const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

// Ensure required environment variables are set and not empty
const requiredEnvVars = ['PORT', 'MONGO_URI', 'STRIPE_SECRET_KEY'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key] || process.env[key].trim() === '') {
    console.error(`Missing or empty required environment variable: ${key}`);
    process.exit(1); // Exit if a required environment variable is missing or empty
  }
});

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  mongoOptions: {
    retryWrites: true,               // Enable retryWrites for failover handling (recommended for Atlas)
    w: 'majority',                  // Ensure write concern is majority
    useNewUrlParser: true,           // Ensure compatibility with new MongoDB connection string parser
    useUnifiedTopology: true,       // Use the new unified topology layer
  },
};
