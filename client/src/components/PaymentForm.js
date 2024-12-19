import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';

const PaymentForm = ({ clientSecret, onPaymentSuccess, setPaymentProcessing, paymentProcessing }) => {
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return <div>Loading...</div>; // Display a spinner or placeholder
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);
    setError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        console.error('Stripe Error:', error);
        setError(`Payment failed: ${error.message}`);
        setPaymentProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        onPaymentSuccess();
        setPaymentProcessing(false);
      }
    } catch (err) {
      console.error('Payment Processing Error:', err);
      setError('An unexpected error occurred. Please try again later.');
      setPaymentProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Complete Your Payment of $5.00 USD</h2>
      <CardElement style={{ marginBottom: '20px' }} />
      <button 
        type="submit" 
        disabled={paymentProcessing || succeeded}
        style={{
          backgroundColor: '#4CAF50', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {paymentProcessing ? 'Processing...' : succeeded ? 'Payment Succeeded' : 'Pay Now'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{error}</div>}
      {succeeded && <div style={{ color: 'green', marginTop: '10px', fontSize: '14px' }}>Thank you! Your payment was successful.</div>}
    </form>
  );
};

PaymentForm.propTypes = {
  clientSecret: PropTypes.string.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
  setPaymentProcessing: PropTypes.func.isRequired,
  paymentProcessing: PropTypes.bool.isRequired,
};

export default PaymentForm;
