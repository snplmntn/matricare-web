import React, { useState, useEffect } from 'react';
import { ImQuotesLeft } from 'react-icons/im';
import '../../style/library/morningsicknessAssistant.css';

function MorningSickness() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [innerBoxes, setInnerBoxes] = useState([
    { title: "Morning Sickness Relief", content: "Tips and remedies to alleviate morning sickness", image: "img/morning_sickness1.webp" },
    { title: "Dealing with Nausea", content: "Strategies for managing nausea during pregnancy", image: "img/morning_sickness2.webp" },
    // Add more inner boxes as needed
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % 5);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide === 0 ? 4 : prevSlide - 1));
  };

  const nextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide + 1) % 5);
  };

  return (
    <div className="morning-sickness-container">
      <div className="morning-sickness-header">
        <div className="morning-sickness-label">MORNING SICKNESS</div>
        <h1 className="morning-sickness-title">Morning Sickness</h1>
        <div className="morning-sickness-subtitle">BY MATRICARE / Medically Reviewed by: [Your Doctor's Name] MD / UPDATED 2024</div>
      </div>
      <div className="morning-sickness-content">
        <p>
          Morning sickness, or nausea and vomiting of pregnancy (NVP), is a common symptom experienced by many pregnant women, especially during the first trimester. It is characterized by feelings of nausea, often accompanied by vomiting, usually in the morning but can occur at any time of the day.
        </p>
        <p>
          While morning sickness can be challenging to deal with, there are various remedies and strategies that can help alleviate symptoms and make you feel more comfortable during this time.
        </p>
        <div className="morning-sickness-quote">
          <ImQuotesLeft className="morning-sickness-quote-icon" />
          <span>Dealing with morning sickness can be challenging, but it's a sign that your body is adjusting to the changes of pregnancy.</span>
          <span className="morning-sickness-quote-author">Anonymous</span>
        </div>
        <div className="morning-sickness-image-container">
          <img src="img/labor1.jpg" alt="Morning Sickness" className="morning-sickness-image" />
        </div>
        <div className="morning-sickness">
          <h2>MORNING SICKNESS</h2>
          <ul className="morning-sickness-list">
            <li>
              <strong>Symptoms:</strong> Morning sickness is characterized by feelings of nausea and vomiting, usually occurring during the first trimester of pregnancy. It can occur at any time of the day, not just in the morning.
            </li>
            <li>
              <strong>Causes:</strong> The exact cause of morning sickness is unknown, but it is believed to be related to hormonal changes during pregnancy. Certain factors, such as a history of motion sickness or migraines, may increase the likelihood of experiencing morning sickness.
            </li>
            <li>
              <strong>Management:</strong> There are several ways to manage morning sickness, including dietary changes, lifestyle modifications, and over-the-counter or prescription medications. It's essential to consult with your healthcare provider before taking any medication during pregnancy.
            </li>
          </ul>
        </div>
        <div className="morning-sickness-additional-info-box">
          <div className="morning-sickness-navigation-buttons">
            <button onClick={prevSlide}>Previous</button>
            <button onClick={nextSlide}>Next</button>
          </div>
          <div className="morning-sickness-box">
            <h2>RELATED ARTICLES</h2>
            <div className="morning-sickness-inner-box">
              <h3>{innerBoxes[currentSlide]?.title}</h3>
              <p>{innerBoxes[currentSlide]?.content}</p>
              <img src={innerBoxes[currentSlide]?.image} alt="Additional Image" />
            </div>
          </div>
        </div>
    
        <div className="section">
            <h2 className="related-articles">Read more about Pregnancy</h2>
            <div className="article-boxes">
              <div className="article-box">
                <img src="img/bg2.jpg" alt="Article Image" />
                <h3>Article Title</h3>
                <p>Article summary or excerpt goes here...</p>
                <a href="#">Read more</a>
              </div>
              <div className="article-box">
                <img src="img/bg2.jpg" alt="Article Image" />
                <h3>Article Title</h3>
                <p>Article summary or excerpt goes here...</p>
                <a href="#">Read more</a>
              </div>
              <div className="article-box">
                <img src="img/bg2.jpg" alt="Article Image" />
                <h3>Article Title</h3>
                <p>Article summary or excerpt goes here...</p>
                <a href="#">Read more</a>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default MorningSickness;
