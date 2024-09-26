import React, { useState } from 'react';
import { IoArrowBackSharp, IoCalculatorOutline  } from 'react-icons/io5';
import { Link } from "react-router-dom";
import '../../styles/features/datecalculator.css';

const DateCalculator = () => {
  const [lmp, setLmp] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [calculatorType, setCalculatorType] = useState('');

  const handleDateChange = (e) => {
    setLmp(e.target.value);
  };

  const handleCalculatorChange = (e) => {
    setCalculatorType(e.target.value);
    setDueDate(null); // Reset dueDate when calculator type changes
  };

  const calculateDueDate = () => {
    if (!lmp) return;

    const lmpDate = new Date(lmp);
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280); // Add 280 days (40 weeks)

    setDueDate(dueDate.toDateString());
  };

  const calculateWeeks = () => {
    if (!lmp) return;

    const lmpDate = new Date(lmp);
    const today = new Date();
    const weeks = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24 * 7));

    setDueDate(`You are ${weeks} weeks pregnant.`);
  };

  const renderCalculatorContent = () => {
    if (calculatorType === 'dueDate') {
      return (
        <div className="DDC-article-section">
          <h2>What is a Pregnancy Due Date?</h2>
          <p>
            A pregnancy due date is an estimate of when a pregnant woman will give birth. It is calculated from the first day of the last menstrual period (LMP). The average pregnancy lasts about 40 weeks, so the due date is typically 280 days from the LMP.
            The due date is important for planning and monitoring the progress of the pregnancy. It helps healthcare providers to schedule necessary tests, track fetal development, and make timely medical decisions.
            Keep in mind that the due date is just an estimate. Only about 5% of babies are born on their due date. Most babies are born within two weeks before or after the due date.
            Several factors can affect the accuracy of the due date, including irregular menstrual cycles, inaccuracies in recalling the LMP, and variations in the length of pregnancy among different women.
            Besides using the LMP to calculate the due date, healthcare providers may use ultrasound measurements in the first trimester to provide a more accurate estimate. This method measures the size of the fetus and can often predict the due date with greater precision.
            It's important to attend all prenatal appointments and follow your healthcare provider's advice to ensure the best outcomes for both the mother and the baby.
          </p>
        </div>
      );
    } else if (calculatorType === 'weeks') {
      return (
        <div className="DDC-article-section">
          <h2>What is a Pregnancy Week Calculator?</h2>
          <p>
            A pregnancy week calculator helps estimate how far along a pregnancy is based on the number of weeks since the first day of the last menstrual period (LMP). It is useful for tracking fetal development, understanding pregnancy milestones, and preparing for childbirth.
            The calculator provides an approximate due date and allows expectant parents to plan for prenatal care, ultrasound appointments, and other pregnancy-related activities. It's an essential tool for healthcare providers and expectant parents alike to monitor the progress of the pregnancy.
            Pregnancy is typically divided into trimesters, each lasting about 13 weeks. The week calculator helps determine which trimester a woman is in and provides insights into fetal growth and development during each stage.
            Remember, every pregnancy is unique, and the calculator provides estimates based on average gestational periods. It's essential to consult healthcare providers for personalized guidance and care throughout the pregnancy journey.
          </p>
        </div>
      );
    } else {
      return ( 
      <div className="DDC-no-content">
      <img src="img/bg2.jpg" alt="Placeholder" className="DDC-placeholder-image" />
    </div>
    );
    }
  };

  return (
    <div className="DDC-calcu-container" style={{ backgroundImage: 'url(/img/appointmentBG.jpg)' }}>
      <Link to="/app" className="DDC-back-button"><IoArrowBackSharp /></Link>
      <div className="DDC-middle-container">
        <div className="DDC-left-column">
          <div className="DDC-information">
            {renderCalculatorContent()}
          </div>
        </div>
        <div className="DDC-vertical-line"></div>
        <div className="DDC-right-column">
          <div className="DDC-input-container">
          <IoCalculatorOutline className="DDC-icon" />
          <label htmlFor="calculatorType" className="DDC-label">Select Calculator Type:</label>
            <select id="calculatorType" className="DDC-calculator-select" onChange={handleCalculatorChange}>
              <option value="">Select Calculator</option>
              <option value="dueDate">Due Date Calculator</option>
              <option value="weeks">Weeks Calculator</option>
            </select>
            {calculatorType && (
              <div className="DDC-calculator-form">
                <label htmlFor="lmp" className="DDC-StartDate">Enter Your Last Menstrual Period Start Date:</label>
                <input
                  type="date"
                  id="lmp"
                  value={lmp}
                  onChange={handleDateChange}
                  className="DDC-input"
                />
                {calculatorType === 'dueDate' && (
                  <button onClick={calculateDueDate} className="DDC-button">Calculate Due Date</button>
                )}
                {calculatorType === 'weeks' && (
                  <button onClick={calculateWeeks} className="DDC-button">Calculate Weeks</button>
                )}
              </div>
            )}
          </div>
          {dueDate && (
            <div className="DDC-result">
              <h2>Result:</h2>
              <p>{dueDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateCalculator;
