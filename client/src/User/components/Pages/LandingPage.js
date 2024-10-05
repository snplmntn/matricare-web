import React from 'react';
import "../../styles/pages/landing.css"; 
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PiFlowerLotusBold } from "react-icons/pi";
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="landing-page"style={{
      position: 'relative',
      zIndex: 0,
    }}>
      <div className="background-image" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("/img/appointmentBG.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
        zIndex: -1, // Ensure the background is behind all other content
      }} />
      <section id="hero" className="hero"> 
        <div className="hero-content-left">
          <div className="hero-content">
            <h1>MatriCare</h1>
            <p> Nurturing Every Step of Your Pregnancy Journey</p>
          </div>
          <button className="download-button">D O W N L O A D </button>
        </div>
        <Slider {...settings}>
          <div className="video-container">
            <video src="img/vg1.mp4" className="hero-video" autoPlay loop muted />
          </div>
          <div className="video-container">
            <video src="img/vg2.mp4" className="hero-video" autoPlay loop muted />
          </div>
          <div className="video-container">
            <video src="img/vg3.mp4" className="hero-video" autoPlay loop muted />
          </div>
        </Slider>
      </section>
      
      <section id="about-us" className="about-us"> 
      <div className="about-content">
      <div className="about-text">
        <h2>M A T R I C A R E</h2>
        <h1>guiding mothers, nurturing futures.</h1>
        <p>
        We're your go-to maternal health app, dedicated to supporting expectant mothers at every stage of pregnancy. With features like appointment scheduling, virtual consultations, mood tracking, and a resource library, we've got you covered. 
        </p>
        <br></br>
        <p>
        Find nearby healthcare providers easily, and personalize your experience by registering. Let Matricare be your trusted companion on the journey to a happy, healthy pregnancy.
        </p>
        <Link to="/signup">
              <button className="download-button1">R E G I S T E R   N O W</button>
            </Link>
      </div>
    </div>
      </section>

      <section id="what-we-do" className="what-we-do">
      <PiFlowerLotusBold className="flower-icon1" />
  <h2>What We Do</h2>
    <div className="services-container">
      <div className="row">
        <div className="service">
          <img src="img/icon2.png" alt="Service Icon" />
          <h3>Appointment System</h3>
          <p>Schedule, reschedule, and receive reminders for appointments with healthcare providers, ensuring smooth and efficient access to the care you need.</p>
          <div class="hover-image">
            <img src="img/service1.jpg" alt="Service 1 Image" />
          </div>
        </div>
        <div className="service2">
        <img src="img/icon3.png" alt="Service Icon" />
          <h3>Fetal's Growth</h3>
          <p>Monitor developmental progress and stay informed about crucial health indicators, empowering you to provide the best care for your little one.</p>
          <div class="hover-image">
            <img src="img/service2.jpg" alt="Service 2 Image" />
          </div>
        </div>
        <div className="service">
        <img src="img/icon1.png" alt="Service Icon" />
          <h3>Resource Library</h3>
          <p>Offering expert insights and practical guidance for every stage of parenthood.</p>
          <div class="hover-image">
            <img src="img/service3.jpg" alt="Service 3 Image" />
          </div>
        </div>
      </div>
  </div>
</section>

<section id="topic-of-interest" className="topic-of-interest">

  <h2>Topic of Interest</h2>
  <div className="topic-boxes">
    <div className="topic-box">
      <img src="/img/topic1.jpg" alt="Topic 1" />
      <p className="topic-text">Birth Stories</p>
    </div>
    <div className="topic-box">
      <img src="/img/topic2.jpg" alt="Topic 2" />
      <p className="topic-text">Maternity Style</p>
    </div>
    <div className="topic-box">
      <img src="/img/topic3.jpg" alt="Topic 3" />
      <p className="topic-text">Pregnancy Fitness</p>
    </div>
    <div className="topic-box">
      <img src="/img/topic4.jpg" alt="Topic 4" />
      <p className="topic-text">Preparing for Baby</p>
    </div>
    <div className="topic-box">
      <img src="/img/topic5.jpg" alt="Topic 5" />
      <p className="topic-text">Pregnancy Safety</p>
    </div>
    <PiFlowerLotusBold className="flower-icon" />
  </div>


</section>

<div className="shadow-box-container">
        <div className="shadow-box"></div>
      </div>

      <section id="landing-contact" className="contactLP-container">
  <h2 className="contactLP-heading">CONTACT WITH US</h2>
  <div className="contactLP-box">
    <p className="contactLP-title">Write a Message</p>
    <form>
      <div className="contactLP-form-group">
        <label htmlFor="fullName"></label>
        <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" className='contactLP-input'/>
      </div>
      <div className="contactLP-form-group">
        <label htmlFor="phoneNumber"></label>
        <input type="text" id="phoneNumber" name="phoneNumber" placeholder="Enter your phone number" className='contactLP-input'/>
      </div>
      <div className="contactLP-form-group">
        <label htmlFor="subject"></label>
        <input type="text" id="subject" name="subject" placeholder="Enter the subject of your message" className='contactLP-input'/>
      </div>
      <div className="contactLP-form-group">
        <label htmlFor="email"></label>
        <input type="email" id="email" name="email" placeholder="Enter your email address" className='contactLP-input'/>
      </div>
      <div className="contactLP-form-group">
        <label htmlFor="message"></label>
        <textarea id="message" name="message" placeholder="Write your message here" className='contactLP-textarea'></textarea>
      </div>
      <button className="contactLP-button" type="submit">SEND A MESSAGE</button>
    </form>
  </div>
</section>

    </div>
  );
}
