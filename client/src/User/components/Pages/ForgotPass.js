import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../styles/pages/forgotpass.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
    setError('');
    
    // Reset email input
    setEmail('');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    // Here you would typically call an API to change the password
    setSuccessMessage('Password changed successfully!');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangePassword(false);
  };

  return (
    <div className="FP-outer-container FP-background">
      <div
        className="background-image"
        style={{ backgroundImage: `url(/img/login.jpg)` }}
      ></div>
      <div className="FP-overlay"></div>
      <h2 className="FP-welcome-message">Create New <br></br>Password!</h2>
      <p className="forgot-pass-text">New Password</p>

      <div className="forgot-password-container">
        {!isChangePassword ? (
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
        ) : (
          <form onSubmit={handleChangePassword}>
            <div className="FP-form-group">
              <input
                className="FP-form-input"
                name='newPassword'
                type="password"
                id="newPassword"
                placeholder=" "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ padding: '15px', width: '400px' }}
                required
              />
              <label htmlFor="newPassword" className="FP-form-label">New Password:</label>
            </div>
            <div className="FP-form-group">
              <input
                className="FP-form-input"
                name='confirmPassword'
                type="password"
                id="confirmPassword"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ padding: '15px', width: '400px' }}
                required
              />
              <label htmlFor="confirmPassword" className="FP-form-label">Confirm New Password:</label>
            </div>
            {passwordError && <div className="FP-error-message">{passwordError}</div>}
            <button type="submit" className='FP-button'>CHANGE PASSWORD</button>
          </form>
        )}
      </div>
    </div>
  );
}