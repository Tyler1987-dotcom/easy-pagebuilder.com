import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './LandingPageForm.css';

const LandingPageForm = ({ onFormSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId] = useState('12345'); // Static or dynamic userId

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { title, content, phoneNumber, userId };  // Include userId in data
      console.log('Sending data:', data);

      await axios.post('/api/pages', data);
      alert('Page created successfully!');

      setTitle('');
      setContent('');
      setPhoneNumber('');
      onFormSubmit();
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Error creating page!');
    }
  };

  // Function to open instructions in a new window
  const openInstructionsWindow = () => {
    const instructionsContent = `
      <html>
        <head>
          <title>Instructions</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #2c3e50;
            }
            h4 {
              color: #2980b9;
            }
            ol {
              margin-left: 20px;
            }
            li {
              margin-bottom: 10px;
            }
            button {
              padding: 10px;
              background-color: #27ae60;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
            button:hover {
              background-color: #2ecc71;
            }
          </style>
        </head>
        <body>
          <h4>How to Create Your Landing Page:</h4>
          <ol>
            <li>Enter your business details (title, description, phone number).</li>
<li>Click "Create Page" to submit the form.</li>
<li>Preview Your Newly Created Page.</li>
<li>Pay $5.00 USD to download the created page as a ZIP file.</li>
<li>Download the ZIP file once the payment is processed.</li>
<li>Upload the ZIP file to your hosting provider to launch your page.</li>

          </ol>
          <button onclick="window.close()">Close</button>
        </body>
      </html>
    `;

    // Open a new window and write the instructions content into it
    const newWindow = window.open('', '', 'width=600,height=400');
    newWindow.document.write(instructionsContent);
    newWindow.document.close();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Enter Business Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Enter Description of Business:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      <div>
        <label>Enter Business Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      {/* Form Submit Button */}
      <button type="submit">Create Page</button>

      {/* Instructions Button to open in a new window */}
      <button type="button" onClick={openInstructionsWindow} className="instructions-btn">
        Instructions
      </button>
    </form>
  );
};

LandingPageForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default LandingPageForm;
