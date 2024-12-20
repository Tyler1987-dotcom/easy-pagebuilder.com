require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const Stripe = require('stripe');
const path = require('path');
const rateLimit = require('express-rate-limit');
const config = require('./config/config.js');
const Page = require('./models/Page.js');

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
  'https://easy-pagebuilder.com', // Advertising domain
  'https://easy-pagebuilder-com-client.onrender.com', // Frontend on Render
  'https://easy-pagebuilder-com-server.onrender.com', // Backend on Render
  'http://localhost:3001', // Local development frontend
  'http://localhost:3000', // Local development frontend
];


// CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log(`Incoming request from origin: ${origin}`); // Debugging log
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`CORS allowed for origin: ${origin}`); // Debugging log for allowed origins
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`); // Debugging log for blocked origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet());
app.use(express.json());

// MongoDB connection
mongoose.connect(config.mongoURI, {
  writeConcern: { w: 'majority', j: true, wtimeout: 5000 },
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API Routes
app.post('/api/pages', async (req, res) => {
  try {
    const newPage = new Page(req.body);
    const savedPage = await newPage.save();
    res.status(201).json(savedPage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/pages', async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate limiting for payment endpoint
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

app.post('/create-payment-intent', paymentLimiter, async (req, res) => {
  try {
    const { pageId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      return res.status(400).json({ error: 'Invalid page ID' });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'client', 'build', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(404).send('File not found');
    }
  });
});

// Health-check
app.get('/health', (req, res) => res.status(200).send('Server is healthy'));

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: statusCode === 500 ? 'Internal Server Error' : err.message });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
