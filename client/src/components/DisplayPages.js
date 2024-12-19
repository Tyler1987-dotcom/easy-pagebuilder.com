import React from 'react';
import PropTypes from 'prop-types';
import './DisplayPages.css';

const DisplayPages = ({ pages, onPagePreview }) => {
  if (!pages || pages.length === 0) {
    return <p>No pages available.</p>;
  }

  return (
    <div className="display-pages">
      <h2>Created Pages</h2>
      <div className="pages-list">
        {pages.map((page) => (
          <div key={page._id} className="page-item">
            <h3>{page.title}</h3>
            <p>{page.content.substring(0, 100)}...</p>
            {page.phoneNumber && (
              <p className="page-phone-number">Phone: {page.phoneNumber}</p>
            )}

            <div className="buttons">
              <button
                onClick={() => onPagePreview(page)}
                aria-label={`Preview ${page.title}`}
              >
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

DisplayPages.propTypes = {
  pages: PropTypes.array.isRequired,
  onPagePreview: PropTypes.func.isRequired,
};

export default DisplayPages;
