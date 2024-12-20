const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const Stripe = require('stripe');
const path = require('path');
const config = require('./config/config.js'); // Import the config file
const Page = require('./models/Page.js'); // Import the Page model

const app = express();

// Validate necessary environment variables
if (!config.stripeSecretKey) {
  console.error('Missing Stripe Secret Key in environment variables.');
  process.exit(1);
}

if (!config.mongoURI) {
  console.error('Missing MongoDB URI in environment variables.');
  process.exit(1);
}

// Initialize Stripe with the secret key from config
const stripe = new Stripe(config.stripeSecretKey);

// Allowed origins for CORS
const allowedOrigins = [
  'https://easy-pagebuilder.com', // Production frontend
  'https://easy-pagebuilder-com-client.onrender.com', // Client domain
  'https://easy-pagebuilder-com-server.onrender.com', // Server domain
  'http://localhost:3001', // Local development frontend
  'http://localhost:3000', // Local development frontend (added for localhost:3000)
];

// CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log(`Incoming request from origin: ${origin}`); // Debugging log
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      console.log(`CORS allowed for origin: ${origin}`); // Debugging log for allowed origins
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`); // Debugging log for blocked origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers like Authorization and Content-Type
}));

// Helmet for security headers
app.use(helmet());

// JSON parser middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(config.mongoURI, {
  ...config.mongoOptions,
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000,
  },
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.post('/api/pages', async (req, res) => {
  try {
    const newPage = new Page(req.body);
    const savedPage = await newPage.save();
    console.log('Page created:', savedPage);
    res.status(201).json(savedPage);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/pages', async (req, res) => {
  try {
    const pages = await Page.find();
    console.log('Pages fetched:', pages);
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { pageId, amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    console.log('Payment intent created:', paymentIntent);
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({
      error: 'Failed to create payment intent',
    });
  }
});

// Serve static files from React's build folder
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Catch-all handler for any request that doesn't match an API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Health-check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).send({ error: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 5000; // Default to 5000 if not set
app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
