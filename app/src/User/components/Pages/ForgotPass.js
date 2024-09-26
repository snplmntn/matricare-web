import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/pages/forgotpass.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!validateEmail()) {
      setError('Please enter a valid email address.');
      return;
    }
    // Add logic to handle password reset
    setSuccessMessage('Password reset link sent to your email.');
    setEmail('');
  };

  return (
    <div className="FP-outer-container FP-background" style={{
      position: 'relative',
      zIndex: 0,
    }}>
      <div className="background-image" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundImage: 'url("/img/login.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.9,
        zIndex: -1, 
      }}/>

      <div className="FP-overlay"></div>
      <h2 className="FP-welcome-message">Create New <br></br>Password!</h2>
      <p className="forgot-pass-text">New Password</p>
      <div className="forgot-password-container">
        <form onSubmit={handleResetPassword}>
          <div className="FP-form-group">
                      <input
                        className="FP-form-input"
                        name='email'
                        type="text"
                        id="email"
                        placeholder=" "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '15px', width: '400px' }}
                        required
                      />
                      <label htmlFor="username" className="FP-form-label">Email:</label>
                    </div>
          {error && <div className="FP-error-message">{error}</div>}
          <button type="submit" className='FP-button'>RESET PASSWORD</button>
          {successMessage && <div className="success-message">{successMessage}</div>}
        </form>
      </div>
    </div>
  );
}
