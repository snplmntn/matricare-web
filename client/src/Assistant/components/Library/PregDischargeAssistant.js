import React, { useState, useEffect } from 'react';
import { ImQuotesLeft } from 'react-icons/im';
import '../../style/library/pregdischargeAssistant.css';

function PregDischarge() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [innerBoxes, setInnerBoxes] = useState([
    { title: "Article 1", content: "Content of the first inner box", image: "img/article1.webp" },
    { title: "Article 2", content: "Content of the second inner box", image: "img/article1.webp" },
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
    <div className="preg-discharge-container">
      <div className="preg-discharge-header">
        <div className="preg-discharge-label">PREGNANCY DISCHARGE</div>
        <h1 className="preg-discharge-title">Pregnancy Discharge</h1>
        <div className="preg-discharge-subtitle">BY MATRICARE / Medically Reviewed by: Donna Jill Alferez-Tungol MD / UPDATED 2024</div>
      </div>
      <div className="preg-discharge-content">
        <p>
          Pregnancy discharge, also known as leukorrhea, is a normal and common occurrence during pregnancy. It is a thin, milky white vaginal discharge that increases in volume as pregnancy progresses. This discharge helps maintain a healthy balance of bacteria in the vagina and protects against infections.
        </p>
        <p>
          While pregnancy discharge is usually harmless, it's important to pay attention to any changes in color, consistency, or odor. A foul-smelling or unusual discharge could indicate an infection or other medical condition that requires attention from your healthcare provider. Be sure to discuss any concerns with your doctor or midwife.
        </p>
        <div className="preg-discharge-quote">
          <ImQuotesLeft className="preg-discharge-quote-icon" />
          <span>The journey of pregnancy is like no other, cherish every moment.</span>
          <span className="preg-discharge-quote-author">UNKNOWN</span>
        </div>
        <div className="preg-discharge-image-container">
          <img src="img/labor1.jpg" alt="Pregnancy Discharge" className="preg-discharge-image" />
        </div>
        <div className="preg-discharge">
          <h2>PREGNANCY DISCHARGE</h2>
          <ul className="preg-discharge-list">
            <li>
              <strong>Leukorrhea:</strong> Pregnancy discharge, also known as leukorrhea, is a thin, milky white vaginal discharge that increases in volume during pregnancy. It is typically odorless and helps maintain vaginal health by flushing out bacteria and dead cells.
            </li>
            <li>
              <strong>Changes in Discharge:</strong> While pregnancy discharge is usually normal, it's important to pay attention to any changes in color, consistency, or odor. A foul-smelling or unusual discharge could indicate an infection or other medical condition that requires attention.
            </li>
            <li>
              <strong>Consult Your Healthcare Provider:</strong> If you have concerns about your pregnancy discharge, be sure to discuss them with your doctor or midwife. They can provide guidance and determine if any further evaluation or treatment is necessary.
            </li>
          </ul>
        </div>
        <div className="preg-discharge-additional-info-box">
          <div className="preg-discharge-navigation-buttons">
            <button onClick={prevSlide}>Previous</button>
            <button onClick={nextSlide}>Next</button>
          </div>
          <div className="preg-discharge-box">
            <h2>RELATED ARTICLES</h2>
            <div className="preg-discharge-inner-box">
              <h3>{innerBoxes[currentSlide]?.title}</h3>
              <p>Read more...</p>
              <img src={innerBoxes[currentSlide]?.image} alt="Additional Image" />
            </div>
          </div>
        </div>
    
        <div className="section">
            <h2 className="related-articles">Read more about Labor and Delivery</h2>
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

export default PregDischarge;
