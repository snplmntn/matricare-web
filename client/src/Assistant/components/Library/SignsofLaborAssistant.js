import React, { useState, useEffect } from 'react';
import { ImQuotesLeft } from 'react-icons/im';
import '../../style/library/signsoflaborAssistant.css';

function SignsofLabor() {
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
    <div className="signs-of-labor-container">
      <div className="signs-of-labor-header">
        <div className="signs-of-labor-label">SIGNS OF LABOR</div>
        <h1 className="labor-title">Labor and Delivery</h1>
        <div className="labor-subtitle">BY MATRICARE / Medically Reviewed by: Donna Jill Alferez-Tungol MD / UPDATED 2024</div>
      </div>
      <div className="labor-content">
        <p>
          Labor and delivery are the culmination of a pregnancy, and understanding the signs can help you prepare for the arrival of your baby. As labor begins, you may experience a variety of symptoms including contractions, lower back pain, and the breaking of the amniotic sac (water breaking). It's important to recognize these signs and know when to contact your healthcare provider.
        </p>
        <p>
          Delivery follows the process of labor, which can be divided into three stages: early labor, active labor, and the delivery of the placenta. Each stage involves different experiences and sensations, and being informed can help you manage your expectations and reduce anxiety. Remember to discuss your birth plan with your healthcare provider and have a support system in place.
        </p>
        <div className="labor-quote">
          <ImQuotesLeft className="labor-quote-icon" />
          <span>The art of mothering is to teach the art of living to children.</span>
          <span className="quote-author">ELAINE HEFFNER</span>
        </div>
        <div className="labor-image-container">
          <img src="img/labor1.jpg" alt="Labor and Delivery" className="labor-image" />
        </div>
        <div className="signs-of-labor">
          <h2>SIGNS OF LABOR</h2>
          <ul className="signs-of-labor-list">
            <li>
              <strong>Contractions:</strong> Regular, strong contractions that increase in intensity and frequency are a key sign of labor. Unlike Braxton Hicks contractions, true labor contractions come at regular intervals and get closer together over time. They also become more intense and do not go away with changes in position or rest.
            </li>
            <li>
              <strong>Back Pain:</strong> Persistent lower back pain, often described as a dull ache, can be a sign of labor, especially if it comes and goes at regular intervals. This type of pain is caused by the baby’s head pressing against the lower back.
            </li>
            <li>
              <strong>Water Breaking:</strong> The breaking of the amniotic sac, or "water breaking," can occur as a sudden gush or a slow trickle of fluid from the vagina. This is a clear or slightly pink fluid and is a sign that labor is imminent or has already begun.
            </li>
            <li>
              <strong>Bloody Show:</strong> A pink or bloody discharge from the cervix, known as the "bloody show," is a sign that the cervix is beginning to dilate and efface in preparation for labor. This discharge is a mix of mucus and blood from the cervix.
            </li>
            <li>
              <strong>Cervical Dilation:</strong> During labor, the cervix begins to open (dilate) and thin out (efface) to allow the baby to move into the birth canal. This process can be monitored by your healthcare provider during examinations.
            </li>
          </ul>
        </div>
        <div className="c-section-info">
          <h2>C-Section</h2>
          <p>
            A Cesarean section (C-section) is a surgical procedure used to deliver a baby through incisions in the mother's abdomen and uterus. It may be performed when vaginal delivery is not possible or safe, such as in cases of certain medical conditions or complications during labor.
          </p>
          <p>
          The type of C-section performed depends on various factors, including the reason for the surgery, the position of the baby, the mother's health, and the preferences of the healthcare provider and patient. It's important to discuss the options with your healthcare provider to understand the best approach for your individual situation.
          </p>
          </div>
            {/* Additional box */}
            <div className="additional-info-box">
    <div className="navigation-buttons">
        <button onClick={prevSlide}>Previous</button>
        <button onClick={nextSlide}>Next</button>
    </div>
    <div className="box">
        <h2>RELATED ARTICLES</h2>
        <div className="inner-box">
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

export default SignsofLabor;
