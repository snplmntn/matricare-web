import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PiFlowerLotusBold } from "react-icons/pi";
import { Link } from "react-router-dom";

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
    <div className="relative z-0">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30 -z-10"
        style={{ backgroundImage: 'url("/img/appointmentBG.jpg")' }}
      />
      {/* Hero Section */}
      <section
        id="hero"
        className="hero relative h-[800px] max-md:h-[600px] overflow-hidden"
      >
        <div className="absolute top-1/2 left-5 max-md:mt-16 max-md:left-4 transform -translate-y-11/12 z-10 max-md:w-[calc(100%-24px)]">
          <div className="text-left bg-transparent p-5 max-md:p-3 rounded-lg">
            <h1 className="text-9xl max-md:text-5xl max-sm:text-3xl italic text-white font-bold">
              MatriCare
            </h1>
            <p className="text-xl max-md:text-lg max-sm:text-xs text-white mt-2">
              Nurturing Every Step of Your Pregnancy Journey
            </p>
          </div>
          <button className="mt-4 px-12 py-5 max-md:px-8 max-md:py-4 max-sm:px-6 max-sm:py-3 bg-purple-800 text-white rounded-full text-lg max-md:text-base max-sm:text-sm font-semibold hover:bg-blue-950 transition">
            D O W N L O A D
          </button>
        </div>
        <Slider {...settings}>
          <div className="rounded-[50px] max-md:rounded-[25px] overflow-hidden bg-transparent">
            <video
              src="img/vg1.mp4"
              className="w-full h-full opacity-70 object-cover"
              autoPlay
              loop
              muted
            />
          </div>
          <div className="rounded-[50px] max-md:rounded-[25px] overflow-hidden bg-transparent">
            <video
              src="img/vg2.mp4"
              className="w-full h-full opacity-70 object-cover"
              autoPlay
              loop
              muted
            />
          </div>
          <div className="rounded-[50px] max-md:rounded-[25px] overflow-hidden bg-transparent">
            <video
              src="img/vg3.mp4"
              className="w-full h-full opacity-70 object-cover"
              autoPlay
              loop
              muted
            />
          </div>
        </Slider>
      </section>

      {/* About Us Section */}
      <section
        id="about-us"
        className="py-20 max-md:py-10 bg-transparent mt-[-300px] max-md:mt-[-150px] z-10 h-[700px] max-md:h-auto"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto h-[800px] max-md:h-auto">
          <div className="mt-[320px] max-md:mt-[100px] flex-1 px-5 max-md:px-3 text-[#042440]">
            <h2 className="text-5xl max-md:text-3xl max-sm:text-2xl mb-2 text-center italic text-[#7c459c] font-bold">
              M A T R I C A R E
            </h2>
            <h1 className="text-2xl max-md:text-xl max-sm:text-lg mb-2 text-center italic text-[#E39FA9] font-semibold">
              guiding mothers, nurturing futures.
            </h1>
            <p className="text-base max-md:text-sm leading-tight mb-5 text-center px-2 max-w-2xl mx-auto">
              We're your go-to maternal health app, dedicated to supporting
              expectant mothers at every stage of pregnancy. With features like
              appointment scheduling, virtual consultations, mood tracking, and
              a resource library, we've got you covered.
            </p>
            <p className="text-base max-md:text-sm leading-tight mb-5 text-center px-2 max-w-2xl mx-auto">
              Find nearby healthcare providers easily, and personalize your
              experience by registering. Let Matricare be your trusted companion
              on the journey to a happy, healthy pregnancy.
            </p>
            <Link to="/signup">
              <button className="mt-5 px-10 py-5 max-md:px-8 max-md:py-4 max-sm:px-6 max-sm:py-3 bg-[#E39FA9] text-white rounded-full text-lg max-md:text-base max-sm:text-sm font-semibold hover:bg-[#7c459c] transition block mx-auto">
                R E G I S T E R N O W
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section
        id="what-we-do"
        className="relative py-12 max-md:py-8 bg-transparent mt-20 max-md:mt-10"
      >
        <PiFlowerLotusBold className="text-[#7c459c] text-[100px] max-md:text-[60px] mx-auto mt-[-20px] max-md:mt-[-10px]" />
        <h2 className="text-[#E39FA9] mt-[-10px] text-center text-5xl max-md:text-3xl max-sm:text-2xl italic mb-12 max-md:mb-8 font-bold">
          What We Do
        </h2>
        <div className="flex flex-col items-center">
          <div className="flex flex-col md:flex-row justify-center items-center w-full gap-8 max-md:gap-4 max-md:px-4">
            <div className="relative m-2 max-md:m-1 rounded-lg h-[200px]  max-md:h-[180px] w-[500px] max-md:w-full max-w-[500px] flex flex-col justify-center items-center  overflow-hidden mt-[-10px] max-md:mt-0 bg-[#9a6cb4]">
              <img
                src="img/icon2.png"
                alt="Service Icon"
                className="w-[50px] max-md:w-[40px] mt-5 max-md:mt-3"
              />
              <h3 className="mb-2 max-md:mb-1 text-white font-bold max-md:text-sm">
                Appointment System
              </h3>
              <p className="mt-2 mb-5 max-md:mt-1 max-md:mb-3 mx-2 text-center text-white max-md:text-xs max-md:px-1">
                Schedule, reschedule, and receive reminders for appointments
                with healthcare providers, ensuring smooth and efficient access
                to the care you need.
              </p>
              <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 hidden group-hover:flex justify-center items-center">
                <img
                  src="img/service1.jpg"
                  alt="Service 1 Image"
                  className="w-[500px] h-[300px] mx-auto"
                />
              </div>
            </div>
            <div className="relative m-2 max-md:m-1 rounded-lg h-[200px] max-md:h-[180px] w-[500px] max-md:w-full max-w-[500px] flex flex-col justify-center items-center overflow-hidden mt-[50px] max-md:mt-0 bg-[#c98f8faf]">
              <img
                src="img/icon3.png"
                alt="Service Icon"
                className="w-[50px] max-md:w-[40px]"
              />
              <h3 className="mb-2 max-md:mb-1 text-white font-bold max-md:text-sm">
                Fetal's Growth
              </h3>
              <p className="mt-2 mb-5 max-md:mt-1 max-md:mb-3 mx-2 text-center text-white max-md:text-xs max-md:px-1">
                Monitor developmental progress and stay informed about crucial
                health indicators, empowering you to provide the best care for
                your little one.
              </p>
              <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 hidden group-hover:flex justify-center items-center">
                <img
                  src="img/service2.jpg"
                  alt="Service 2 Image"
                  className="w-[500px] h-[300px] mx-auto"
                />
              </div>
            </div>
            <div className="relative m-2 max-md:m-1 rounded-lg h-[200px] max-md:h-[180px] w-[500px] max-md:w-full max-w-[500px] flex flex-col justify-center items-center overflow-hidden mt-[-10px] max-md:mt-0 bg-[#9a6cb4]">
              <img
                src="img/icon1.png"
                alt="Service Icon"
                className="w-[50px] max-md:w-[40px] mt-5 max-md:mt-3"
              />
              <h3 className="mb-2 max-md:mb-1 text-white font-bold max-md:text-sm">
                Resource Library
              </h3>
              <p className="mt-2 mb-5 max-md:mt-1 max-md:mb-3 mx-2 text-center text-white max-md:text-xs max-md:px-1">
                Offering expert insights and practical guidance for every stage
                of parenthood.
              </p>
              <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 hidden group-hover:flex justify-center items-center">
                <img
                  src="img/service3.jpg"
                  alt="Service 3 Image"
                  className="w-[500px] h-[300px] mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic of Interest Section */}
      <section
        id="topic-of-interest"
        className="py-12 max-md:py-8 bg-transparent mt-[-50px] max-md:mt-[-20px] h-[900px] max-md:h-auto"
      >
        <h2 className="mt-[-20px] max-md:mt-0 py-12 max-md:py-8 text-center text-5xl max-md:text-3xl max-sm:text-2xl text-[#7c459c] italic font-bold">
          Topic of Interest
        </h2>
        <div className="flex flex-wrap justify-around items-center max-md:justify-center max-md:px-4">
          <div className="flex-1 max-w-xs max-md:max-w-[150px] max-sm:max-w-[120px] text-center mb-8 max-md:mb-4 mx-2 max-md:mx-1">
            <img
              src="/img/topic1.jpg"
              alt="Topic 1"
              className="w-full rounded-lg"
            />
            <p className="mt-2 text-lg max-md:text-sm max-sm:text-xs italic text-[#042440]">
              Birth Stories
            </p>
          </div>
          <div className="flex-1 max-w-xs max-md:max-w-[150px] max-sm:max-w-[120px] text-center mb-8 max-md:mb-4 mx-2 max-md:mx-1">
            <img
              src="/img/topic2.jpg"
              alt="Topic 2"
              className="w-full rounded-lg"
            />
            <p className="mt-2 text-lg max-md:text-sm max-sm:text-xs italic text-[#042440]">
              Maternity Style
            </p>
          </div>
          <div className="flex-1 max-w-xs max-md:max-w-[150px] max-sm:max-w-[120px] text-center mb-8 max-md:mb-4 mx-2 max-md:mx-1">
            <img
              src="/img/topic3.jpg"
              alt="Topic 3"
              className="w-full rounded-lg"
            />
            <p className="mt-2 text-lg max-md:text-sm max-sm:text-xs italic text-[#042440]">
              Pregnancy Fitness
            </p>
          </div>
          <div className="flex-1 max-w-xs max-md:max-w-[150px] max-sm:max-w-[120px] text-center mb-8 max-md:mb-4 mx-2 max-md:mx-1">
            <img
              src="/img/topic4.jpg"
              alt="Topic 4"
              className="w-full rounded-lg"
            />
            <p className="mt-2 text-lg max-md:text-sm max-sm:text-xs italic text-[#042440]">
              Preparing for Baby
            </p>
          </div>
          <div className="flex-1 max-w-xs max-md:max-w-[150px] max-sm:max-w-[120px] text-center mb-8 max-md:mb-4 mx-2 max-md:mx-1">
            <img
              src="/img/topic5.jpg"
              alt="Topic 5"
              className="w-full rounded-lg"
            />
            <p className="mt-2 text-lg max-md:text-sm max-sm:text-xs italic text-[#042440]">
              Pregnancy Safety
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="landing-contact"
        className="py-12 max-md:py-8 bg-transparent font-serif mt-[-20px] max-md:mt-0"
      >
        <PiFlowerLotusBold className="text-[#7c459c] text-[100px] max-md:text-[60px] mx-auto mt-10 max-md:mt-5" />
        <h2 className="text-center mb-8 max-md:mb-6 border-2 border-[#E39FA9] rounded-full px-6 py-2 max-md:px-4 max-md:py-1 bg-[#E39FA9] text-white text-lg max-md:text-base max-sm:text-sm font-normal w-fit mx-auto mt-2">
          CONTACT WITH US
        </h2>
        <div className="max-w-xl mx-auto p-5 max-md:p-3 max-md:max-w-lg">
          <p className="text-center mb-5 max-md:mb-3 text-3xl max-md:text-2xl max-sm:text-xl font-bold mt-[-30px] max-md:mt-[-20px] ml-12 max-md:ml-0 text-[#7c459c]">
            Write a Message
          </p>
          <form
            action="https://formsubmit.co/beabenella.rosal@gmail.com"
            method="POST"
            target="_blank"
            className="flex flex-wrap justify-between"
          >
            <div className="flex-1 min-w-[45%] max-md:min-w-full mb-5 max-md:mb-3">
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                className="w-full p-5 max-md:p-3 border border-gray-300 rounded bg-[#e39fa977] mb-2 max-md:mb-1 text-base max-md:text-sm"
              />
            </div>
            <div className="flex-1 min-w-[45%] max-md:min-w-full mb-5 max-md:mb-3 max-md:ml-0 ml-2">
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number"
                className="w-full p-5 max-md:p-3 border border-gray-300 rounded bg-[#e39fa977] mb-2 max-md:mb-1 text-base max-md:text-sm"
              />
            </div>
            <div className="flex-1 min-w-[45%] max-md:min-w-full mb-5 max-md:mb-3">
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter the subject of your message"
                className="w-full p-5 max-md:p-3 border border-gray-300 rounded bg-[#e39fa977] mb-2 max-md:mb-1 text-base max-md:text-sm"
              />
            </div>
            <div className="flex-1 min-w-[45%] max-md:min-w-full mb-5 max-md:mb-3 max-md:ml-0 ml-2">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                className="w-full p-5 max-md:p-3 border border-gray-300 rounded bg-[#e39fa977] mb-2 max-md:mb-1 text-base max-md:text-sm"
              />
            </div>
            <div className="w-full mb-5 max-md:mb-3">
              <textarea
                id="message"
                name="message"
                placeholder="Write your message here"
                className="w-full bg-[#e39fa977] border border-gray-300 rounded p-5 max-md:p-3 h-[200px] max-md:h-[150px] text-base max-md:text-sm"
              ></textarea>
            </div>
            <button
              className="bg-[#E39FA9] px-10 py-4 max-md:px-8 max-md:py-3 max-sm:px-6 max-sm:py-2 text-white rounded-full font-serif mx-auto block hover:bg-[#9a6cb4] transition text-base max-md:text-sm"
              type="submit"
            >
              SEND A MESSAGE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
