import React, { useState, useEffect } from 'react';
import LandingPageForm from './components/LandingPageForm';
import DisplayPages from './components/DisplayPages';
import LandingPage from './components/LandingPage';
import axios from 'axios';
import JSZip from 'jszip';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './components/PaymentForm';
import config from './config'; // Import the config file
import './App.css';

// Initialize Stripe with the publishable key from config
const stripePromise = config.stripePublishableKey ? loadStripe(config.stripePublishableKey) : null;

const App = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Fetch pages from the server
  const fetchPages = async () => {
    try {
      const response = await axios.get(`${config.apiBaseURL}/api/pages`);
      console.log('Fetched pages:', response.data); // Log the response to check its structure
  
      // Ensure response.data is an array before setting state
      if (Array.isArray(response.data)) {
        setPages(response.data); // No need to reverse as the backend already sorts it
      } else {
        console.error('Fetched data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };
  

  // Function to create payment intent and get client secret
  const createPaymentIntent = async (pageId) => {
    try {
      const response = await axios.post(`${config.apiBaseURL}/create-payment-intent`, {
        pageId,
        amount: 5,
      });
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  // Handle page preview
  const handlePagePreview = (page) => {
    setSelectedPage(page);
    createPaymentIntent(page._id); // Assuming page has an _id field
  };

  // Handle ZIP file download
  const handleDownload = async (page) => {
    if (paymentProcessing) return; // Prevent download if payment is still processing
    if (!page) return; // Ensure a page is selected before proceeding

    try {
      const zip = new JSZip();
      const htmlContent = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${page.title}</title>
          <style>
            .landing-page__container {
              width: 80%;
              max-width: 900px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fafafa;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              font-family: 'Arial', sans-serif;
              text-align: center;
              line-height: 1.6;
              word-wrap: break-word;
            }

            .landing-page__title {
              font-size: 2.5rem;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 20px;
            }

            .landing-page__content {
              font-size: 1.125rem;
              color: #34495e;
              margin-bottom: 20px;
              word-wrap: break-word;
            }

            .landing-page__phone-number {
              color: #2980b9;
              font-weight: bold;
              text-decoration: none;
              font-size: 1.25rem;
            }

            .landing-page__phone-number:hover {
              text-decoration: underline;
              color: #1abc9c;
            }

            @media (max-width: 600px) {
              .landing-page__container {
                padding: 10px;
                width: 100%;
              }

              .landing-page__title {
                font-size: 1.75rem;
              }

              .landing-page__content {
                font-size: 1rem;
              }

              .landing-page__phone-number {
                font-size: 1.125rem;
              }
            }
          </style>
        </head>
        <body>
          <div class="landing-page__container">
            <h1 class="landing-page__title">${page.title}</h1>
            <p class="landing-page__content">${page.content}</p>
            <p><strong>Call Us:</strong> <a href="tel:${page.phoneNumber}" class="landing-page__phone-number">${page.phoneNumber}</a></p>
          </div>
        </body>
      </html>`;

      zip.file('index.html', htmlContent);
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(zipBlob);
      downloadLink.download = `${encodeURIComponent(page.title.replace(/\s+/g, '_'))}.zip`;
      document.body.appendChild(downloadLink);

      downloadLink.click();
      downloadLink.remove();
    } catch (error) {
      console.error('Error generating ZIP file:', error);
    }
  };

  // Handle going back to the DisplayPages
  const handleBackToDisplayPages = () => {
    setSelectedPage(null); // Clear the selected page to show the DisplayPages again
    setClientSecret(''); // Clear client secret
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <div>
        <h1 style={{ textAlign: 'center' }}>Landing Page Generator</h1>
        <div className="container">
  <LandingPageForm onFormSubmit={fetchPages} />
  {selectedPage ? (
    <div>
      <LandingPage
        page={selectedPage}
        clientSecret={clientSecret}
        onDownload={handleDownload}
      />
      <div className="button-payment-container">
        {clientSecret && stripePromise && (
          <PaymentForm
            clientSecret={clientSecret}
            onPaymentSuccess={() => handleDownload(selectedPage)}
            setPaymentProcessing={setPaymentProcessing}
            paymentProcessing={paymentProcessing}
          />
        )}
        <button
          onClick={handleBackToDisplayPages}
          className="back-to-display-btn"
        >
          Back to Display Pages
        </button>
      </div>
    </div>
  ) : (
    <DisplayPages
      pages={pages}
      onPagePreview={handlePagePreview}
    />
  )}
</div>


      </div>
    </Elements>
  );
};

export default App;










