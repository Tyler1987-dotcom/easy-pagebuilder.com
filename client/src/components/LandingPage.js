import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import './LandingPage.css';

const LandingPage = ({ page, clientSecret, onDownload }) => {
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const formatPhoneNumber = (phoneNumber) => {
    const phone = parsePhoneNumberFromString(phoneNumber, 'US');
    return phone ? phone.formatInternational() : phoneNumber;
  };

  const handlePaymentSuccess = () => {
    alert('Payment successful! You can now download the landing page.');
    onDownload(page);
  };

  return (
    <div className="landing-page__container">
      <h1 className="landing-page__title">{page.title}</h1>
      <p className="landing-page__content">{page.content}</p>
      <p>
        <strong>Call Us:</strong>{' '}
        <a href={`tel:${page.phoneNumber}`} className="landing-page__phone-number">
          {formatPhoneNumber(page.phoneNumber)}
        </a>
      </p>
    </div>
  );
};

LandingPage.propTypes = {
  page: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    clientSecret: PropTypes.string.isRequired,
  }).isRequired,
  clientSecret: PropTypes.string.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default LandingPage;
