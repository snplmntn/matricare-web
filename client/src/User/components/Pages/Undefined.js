import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../../styles/pages/undefined.css"; 

const Undefined = () => {
  const navigate = useNavigate();

  const goToHomepage = () => {
    navigate('/'); // Navigate to the homepage
  };

  return (
    <div className="undefined-page-container" style={{ backgroundImage: `url(/img/undefined.svg)` }}>
      <div className="undefined-content">
        <h1 className="undefined-oops-text">Oops</h1>
        <h2 className="undefined-missing-text">Something is Missing.</h2>
        <p className="undefined-error-message">
          The page you are looking for cannot <br></br>be found. Take a break before trying again.
        </p>
        <button className="undefined-back-button" onClick={goToHomepage}>
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default Undefined;
