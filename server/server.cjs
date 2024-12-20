require('dotenv').config(); // Load environment variables at the top
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const Stripe = require('stripe');
const path = require('path');
const rateLimit = require('express-rate-limit');
const config = require('./config/config.js');
const Page = require('./models/Page.js');
const fs = require('fs');

const app = express();

// Validate environment variables
if (!config.stripeSecretKey || !config.mongoURI) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

// Initialize Stripe
const stripe = new Stripe(config.stripeSecretKey);

// Allowed origins for CORS
const allowedOrigins = [
  'https://easy-pagebuilder.com', // Production frontend
  'https://www.easy-pagebuilder.com', // Production frontend (ensure both www and non-www versions are covered)
  'https://easy-pagebuilder-com-client.onrender.com', // Client domain (Render client)
  'https://easy-pagebuilder-com-server.onrender.com', // Server domain (Render server)
  'http://localhost:3000', // Local development frontend (React default port)
  'http://localhost:3001', // Local development frontend (another possible port for React dev server)
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

// Helmet Middleware for security headers
const cspOptions = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://js.stripe.com',
    ],
    connectSrc: [
      "'self'",
      'https://api.stripe.com',
      'https://easy-pagebuilder.com',
      'https://easy-pagebuilder-com-client.onrender.com',
      'https://easy-pagebuilder-com-server.onrender.com',
    ],
    imgSrc: ["'self'", 'https://www.google-analytics.com'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'"],
    frameSrc: ["'self'", "https://js.stripe.com"],
  },
};

app.use(helmet.contentSecurityPolicy(cspOptions));

app.use(express.json());

// MongoDB connection
mongoose.connect(config.mongoURI, config.mongoOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create a new page
app.post('/api/pages', async (req, res) => {
  try {
    const newPage = new Page(req.body);
    const savedPage = await newPage.save();
    res.status(201).json(savedPage);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all pages
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 }); // Sort by creation date in descending order
    if (!pages || pages.length === 0) {
      return res.status(404).json({ message: 'No pages found' });
    }
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rate limiting for payment endpoint
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

app.post('/create-payment-intent', paymentLimiter, async (req, res) => {
  try {
    const { pageId } = req.body;

    // Fixed amount of $5.00
    const amount = 5.00;

    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      return res.status(400).json({ error: 'Invalid page ID' });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error.message); // Log error message
    res.status(500).send({ error: 'Failed to create payment intent', details: error.message });
  }
});

// Serve static files
const buildPath = path.join(__dirname, '..', 'client', 'build');
if (!fs.existsSync(buildPath)) {
  console.warn(`Warning: Build folder not found at ${buildPath}`);
}

app.use(express.static(buildPath));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  const filePath = path.join(buildPath, 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(404).send('File not found');
    }
  });
});

// Health-check
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).send('Server is healthy');
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).send('Server is unhealthy');
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: statusCode === 500 ? 'Internal Server Error' : err.message });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
