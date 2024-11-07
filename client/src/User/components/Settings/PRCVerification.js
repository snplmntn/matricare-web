import React, { useState, useRef, useEffect } from "react";
import { FaCamera, FaIdCard, FaArrowLeft, FaPaperclip } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/settings/prcverification.css";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

const PRCVerification = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const userID = getCookie("userID");

  const [step1Completed, setStep1Completed] = useState(false);
  const [step1Clicked, setStep1Clicked] = useState(false);
  const [showStep2, setShowStep2] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [capturedImageStep1, setCapturedImageStep1] = useState(null);
  const [capturedImageStep2, setCapturedImageStep2] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const videoRefStep1 = useRef(null);
  const videoRefStep2 = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStreamStep1, setCameraStreamStep1] = useState(null);
  const [cameraStreamStep2, setCameraStreamStep2] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (step1Clicked && !cameraStreamStep1) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setCameraStreamStep1(stream);
          if (videoRefStep1.current) {
            videoRefStep1.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing the Step 1 camera:", error);
          alert("Could not access the camera for Step 1");
        });
    }

    if (showStep2 && !cameraStreamStep2) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setCameraStreamStep2(stream);
          if (videoRefStep2.current) {
            videoRefStep2.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing the Step 2 camera:", error);
          alert("Could not access the camera for Step 2");
        });
    }

    return () => {
      if (cameraStreamStep1) {
        const tracks = cameraStreamStep1.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (cameraStreamStep2) {
        const tracks = cameraStreamStep2.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [step1Clicked, showStep2, cameraStreamStep1, cameraStreamStep2]);

  const handleStep1Click = () => {
    setStep1Clicked(true);
  };

  const handleStep2Click = () => {
    if (capturedImageStep1) setStep1Completed(true);
    if (capturedImageStep1) {
      setShowStep2(true);
    } else {
      alert("Please complete Step 1 first");
    }
  };

  // Convert data URL to Blob
  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    setSelectedImages((prev) => [
      ...prev,
      new Blob([ab], { type: mimeString }),
    ]);
    return new Blob([ab], { type: mimeString });
  };
  // Capture image and convert to Blob
  const captureImage = (videoRef, setImageState) => {
    const canvas = canvasRef.current;
    if (canvas && videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/png");
      dataURLToBlob(imageUrl); // Convert to Blob
      setImageState(imageUrl); // Store the Blob instead of data URL
    }
  };
  const handleCameraCaptureStep1 = () => {
    captureImage(videoRefStep1, setCapturedImageStep1);
    alert("ID Photo Taken for Step 1!");
  };

  const handleCameraCaptureStep2 = () => {
    captureImage(videoRefStep2, setCapturedImageStep2);
    alert("Selfie Taken for Step 2!");
  };

  const handleBackButtonClick = () => {
    setShowStep2(false);
    setStep1Clicked(false);
  };

  const handleRedirect = () => {
    navigate("/userprofile");
  };

  const handleBackToUserProfile = () => {
    navigate("/userprofile");
  };

  const uploadPRCId = async () => {
    if (selectedImages && selectedImages.length > 0) {
      const formData = new FormData();

      // Loop through each image in selectedImage array and append it to formData
      selectedImages.forEach((image) => {
        formData.append("document", image);
      });

      try {
        const response = await axios.post(
          `${API_URL}/upload/id?userId=${userID}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.pictureLink;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    if (capturedImageStep1 && capturedImageStep2) {
      const prcId = await uploadPRCId();
      const response = await axios.put(
        `${API_URL}/user?userId=${userID}`,
        {
          prcId: prcId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Documents Submitted!");
      setSubmitted(true);
    } else {
      alert("Please complete both steps first");
    }
  };

  const UploadIdFromFiles = async (e) => {
    const file = e.target.files[0];
    setSelectedImages([file]);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImageStep1(imageUrl);
    }
  };

  return (
    <div className="prc-verification-container">
      <button className="prc-back" onClick={handleBackToUserProfile}>
        <FaArrowLeft />
      </button>
      <div className="prc-content">
        {!submitted && !step1Clicked && !showStep2 && (
          <>
            <img src="img/logo3.png" alt="Logo" className="prc-logo" />
            <h1>Submit Documents</h1>
            <p>
              We need to verify your information. <br />
              Please submit the documents below to process your verification.
            </p>

            <div className="step-container" onClick={handleStep1Click}>
              <div className="step">
                <FaIdCard className="step-icon" />
                <div className="step-text-container">
                  <span className="step-text">Step 1</span>
                  <span>Photo ID</span>
                </div>
              </div>
            </div>

            <div
              className="step-container clickable"
              onClick={handleStep2Click}
            >
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

        {submitted && (
          <div className="thank-you-message">
            <img
              src="img/verification.png"
              alt="Logo"
              className="prc-verlogo"
            />
            <h1>Thank you!</h1>
            <p>
              Your data is being processed and <br />
              you can already enjoy all the features of the application.
            </p>
            <button className="prc-submit-button" onClick={handleRedirect}>
              Let's Go!
            </button>
          </div>
        )}

        {step1Clicked && !step1Completed && (
          <div className="camera-wrapper">
            <div className="camera-header">
              <button
                className="prc-back-button"
                onClick={handleBackButtonClick}
              >
                <FaArrowLeft />
              </button>
              <h2>Take a Photo of Your ID</h2>

              <button className="prc-clip-button">
                <input
                  type="file"
                  id="profileImage"
                  className="user-profile-image-input"
                  accept="image/*"
                  onChange={UploadIdFromFiles}
                  style={{ display: "none" }} // Hide the default file input
                />
                <label htmlFor="profileImage" style={{ cursor: "pointer" }}>
                  <FaPaperclip />
                </label>
              </button>
            </div>
            <div className="camera-container">
              {capturedImageStep1 ? (
                <img
                  src={capturedImageStep1}
                  alt="Captured ID"
                  width="100%"
                  height="auto"
                />
              ) : (
                <video
                  ref={videoRefStep1}
                  autoPlay
                  width="100%"
                  height="auto"
                />
              )}
            </div>
            <button
              className="camera-button"
              onClick={handleCameraCaptureStep1}
            >
              Capture Photo
            </button>
          </div>
        )}

        {showStep2 && !submitted && (
          <div className="camera-wrapper">
            <div className="camera-header">
              <button
                className="prc-back-button"
                onClick={handleBackButtonClick}
              >
                <FaArrowLeft />
              </button>
              <h2>Upload Selfie with Your ID</h2>
              <button className="prc-clip-button">
                <FaPaperclip />
              </button>
            </div>
            <div className="camera-container">
              {capturedImageStep2 ? (
                <img
                  src={capturedImageStep2}
                  alt="Captured Selfie"
                  width="100%"
                  height="auto"
                />
              ) : (
                <video
                  ref={videoRefStep2}
                  autoPlay
                  width="100%"
                  height="auto"
                />
              )}
            </div>
            <button
              className="camera-button"
              onClick={handleCameraCaptureStep2}
            >
              Capture Selfie
            </button>
          </div>
        )}

        {!submitted && (
          <div className="prc-button-container">
            {!step1Completed && (
              <button className="prc-submit-button" onClick={handleStep2Click}>
                {step1Clicked ? "Next" : "Submit"}
              </button>
            )}

            {showStep2 && step1Completed && (
              <button className="prc-submit-button" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>
    </div>
  );
};

export default PRCVerification;
