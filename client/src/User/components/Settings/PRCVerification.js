import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaIdCard, FaArrowLeft, FaPaperclip } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import "../../styles/settings/prcverification.css";

const PRCVerification = () => {
  const [step1Completed, setStep1Completed] = useState(false);
  const [step1Clicked, setStep1Clicked] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showStep2, setShowStep2] = useState(false);
  const [submitted, setSubmitted] = useState(false); // New state to track submission
  const videoRef = useRef(null); // Reference for the video element
  const [cameraStream, setCameraStream] = useState(null); // To store the camera stream

  const navigate = useNavigate(); // To handle navigation

  useEffect(() => {
    if (showCamera) {
      // Request the camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setCameraStream(stream); // Store the stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream; // Attach the camera stream to the video element
          }
        })
        .catch((error) => {
          console.error('Error accessing the camera:', error);
          alert('Could not access the camera');
        });
    }

    // Cleanup the camera when the component unmounts or the camera is no longer needed
    return () => {
      if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach(track => track.stop()); // Stop the camera stream
      }
    };
  }, [showCamera, cameraStream]);

  const handleStep1Click = () => {
    setStep1Clicked(true); // Mark Step 1 as clicked
    setShowCamera(true); // Start showing the camera
  };

  const handleStep2Click = () => {
    setShowStep2(true); // Proceed to Step 2 (Take a Selfie)
    setShowCamera(true); // Start showing the camera for Step 2
  };

  const handleCameraCapture = () => {
    if (videoRef.current) {
      alert('ID Photo Taken!');
      setStep1Completed(true); // Mark Step 1 as completed
      setShowCamera(false); // Hide the camera after the photo is taken
    }
  };

  const handleBackButtonClick = () => {
    setShowCamera(false);
    setStep1Clicked(false); // Reset Step 1 click state
    setShowStep2(false); // Hide Step 2 if going back
  };

  const handleNextClick = () => {
    if (step1Completed) {
      setShowStep2(true);  // Make sure this is triggered when step1 is done
    } else {
      alert('Please complete Step 1 first');
    }
  };

  const handleSubmit = () => {
    setSubmitted(true); // Mark as submitted
  };

  const handleRedirect = () => {
    navigate('/userprofile'); // Navigate to /userprofile when "Let's Go!" is clicked
  };

  const handleBackToUserProfile = () => {
    navigate('/userprofile'); // Navigate back to user profile
  };

  return (
    <div className="prc-verification-container">
        <button className="prc-back" onClick={handleBackToUserProfile}>
        <FaArrowLeft />
      </button>
      <div className="prc-content">
        {/* Show introductory content only when step1Clicked or step2Clicked is false */}
        {!submitted && !step1Clicked && !showStep2 && (
          <>
            <img src="img/logo3.png" alt="Logo" className="prc-logo" />
            <h1>Submit Documents</h1>
            <p>We need to verify your information. <br />Please submit the documents below to process your verification.</p>

            <div className="step-container" onClick={handleStep1Click}>
              <div className="step">
                <FaIdCard className="step-icon" />
                <div className="step-text-container">
                  <span className="step-text">Step 1</span>
                  <span>Photo ID</span>
                </div>
              </div>
            </div>

            <div className="step-container clickable" onClick={handleStep2Click}>
              <div className="step">
                <FaCamera className="step-icon" />
                <div className="step-text-container">
                  <span className="step-text">Step 2</span>
                  <span>Take a Selfie</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Thank you message section */}
        {submitted && (
          <div className="thank-you-message">
            <img src="img/verification.png" alt="Logo" className="prc-verlogo" />
            <h1>Thank you!</h1>
            <p>Your data is being processed and <br />you can already enjoy all the features of the application.</p>
            <button className="prc-submit-button" onClick={handleRedirect}>
              Let's Go!
            </button>
          </div>
        )}

        {showCamera && !showStep2 && (
          <div className="camera-wrapper">
            <div className="camera-header">
              <button className="prc-back-button" onClick={handleBackButtonClick}>
                <FaArrowLeft />
              </button>
              <h2>Take a Photo of Your ID</h2>
              <button className="prc-clip-button">
                <FaPaperclip />
              </button>
            </div>
            <div className="camera-container">
              <video ref={videoRef} autoPlay width="100%" height="auto" />
            </div>
            <button className="camera-button" onClick={handleCameraCapture}>
              Capture Photo
            </button>
          </div>
        )}

        {/* Show Camera for Step 2 */}
        {showStep2 && (
          <div className="camera-wrapper">
            <div className="camera-header">
              <button className="prc-back-button" onClick={handleBackButtonClick}>
                <FaArrowLeft />
              </button>
              <h2>Upload Selfie with Your ID</h2>
              <button className="prc-clip-button">
                <FaPaperclip />
              </button>
            </div>
            <div className="camera-container">
              <video ref={videoRef} autoPlay width="100%" height="auto" />
            </div>
            <button className="camera-button" onClick={handleCameraCapture}>
              Capture Selfie
            </button>
          </div>
        )}

        {/* Submit / Next button, only show when not submitted */}
        {!submitted && (
          <div className="prc-button-container">
            {!step1Completed && (
              <button className="prc-submit-button" onClick={handleNextClick}>
                {step1Clicked ? "Next" : "Submit"}
              </button>
            )}

            {step1Completed && !showStep2 && (
              <button className="prc-submit-button" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PRCVerification;
