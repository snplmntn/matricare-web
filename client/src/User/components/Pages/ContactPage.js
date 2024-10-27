import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa"; // Import icons
import "../../styles/pages/contact.css";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container">
        <div className="text-2xl">Thank you!</div>
        <div className="text-md">We'll be in touch soon.</div>
      </div>
    );
  }

  return (
    <div className="contact-1">
      <div className="contact-page1">
        <img
          src="img/labor1.jpg"
          alt="Contact Image"
          className="contact-image"
        />
        <h2>Contact Us</h2>
        <p>Feel free to reach out to us!</p>
      </div>
      <div className="contact-page2">
        <h2>Contact Information</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod <br></br>tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="contact-infos">
          <p>
            <span className="icon-circ">
              <FaMapMarkerAlt className="icn-design" />
            </span>{" "}
            Address: 667 Dalupan Street Sampaloc 1008 Manila Metro Manila
          </p>
          <p>
            <span className="icon-circ">
              <FaEnvelope className="icn-design" />
            </span>{" "}
            Email: no-reply@matricare.site
          </p>
          <p>
            <span className="icon-circ">
              <FaPhone className="icn-design" />
            </span>{" "}
            Contact: +1234567890
          </p>
        </div>
        <div className="location-info">
          <h2>Our Location</h2>
          <p>
            Mary Chiles Hospital - 667 Dalupan Street Sampaloc 1008 Manila Metro
            Manila
          </p>
          <img src="img/map.png" className="image" />

          <div className="social-icons">
            <h3>Social Media</h3>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social"
            >
              <FaFacebook className="social-icon" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social"
            >
              <FaTwitter className="social-icon" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social"
            >
              <FaInstagram className="social-icon" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social"
            >
              <FaYoutube className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      <div className="get-in-touch-container">
        <div className="get-in-touch">
          <h2>Get in Touch!</h2>
          <p>Feel free to reach out to us.</p>
        </div>
        <form
          action="https://formsubmit.co/beabenella.rosal@gmail.com"
          method="POST"
          target="_blank"
        >
          <div className="pt-0 mb-3">
            <input
              type="text"
              placeholder="Your name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="pt-0 mb-3">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="pt-0 mb-3">
            <textarea
              placeholder="Your message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="pt-0 mb-3">
            <button type="submit">Send a message</button>
          </div>
        </form>
      </div>
    </div>
  );
}
