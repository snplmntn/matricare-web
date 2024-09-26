import React from 'react';
import '../../styles/library/library5.css'
import { IoBookmark, IoShareSocial } from 'react-icons/io5'; 

const Library5 = () => {
  return (
    <div className="library-content-container">
  <div className="library-content-main-news">
      <div className="library-content-news-title-actions">
        <h1 className="library-content-news-title">Essential Pregnancy Safety Measures: Protecting Both Mother and Baby</h1>
        <div className="library-content-news-actions">  
          <button className="library-content-save-btn"><IoBookmark /> Save to Library </button>
          <button className="library-content-share-btn"><IoShareSocial /> Share on media</button>
        </div>
      </div>
      <p className="library-content-news-details">Medically Reviewed by: Dra. Donna Jill A. Tungol </p>
      <p className="library-content-news-date">11/30/2019 08:33 PM EST</p>
      <div className="library-content-news-description">
      <h2>Pregnancy Safety</h2>
            <p>Pregnancy safety encompasses a range of practices and precautions designed to ensure the health and well-being of both the expecting mother and her developing baby throughout the pregnancy journey. It involves proactive measures to address both physical and emotional aspects of pregnancy, aiming to minimize risks and promote a healthy outcome for both mother and child.</p>

            <h3>1. Prenatal Care</h3>
            <p><strong>Regular Checkups:</strong></p>
            <ul>
              <li><strong>Frequency:</strong> Typically, prenatal visits are scheduled every four weeks during the first 28 weeks of pregnancy, every two weeks from 28 to 36 weeks, and weekly from 36 weeks until delivery.</li>
              <li><strong>What’s Monitored:</strong> These visits track fetal growth, heart rate, maternal health, and any potential issues such as high blood pressure or gestational diabetes.</li>
            </ul>
            <p><strong>Screenings and Tests:</strong></p>
            <ul>
              <li><strong>Ultrasounds:</strong> Used to check fetal development, detect multiple pregnancies, and assess the location of the placenta.</li>
              <li><strong>Blood Tests:</strong> Screen for anemia, blood type, Rh factor, and infections such as HIV or hepatitis B.</li>
              <li><strong>Genetic Testing:</strong> Optional tests to assess the risk of genetic disorders.</li>
            </ul>

            <h3>2. Medication and Supplements</h3>
            <p><strong>Consulting Healthcare Providers:</strong></p>
            <ul>
              <li><strong>Medication Review:</strong> Regularly review all medications with a healthcare provider to ensure they are safe for pregnancy and consider alternatives if necessary.</li>
            </ul>
            <p><strong>Prenatal Vitamins:</strong></p>
            <ul>
              <li><strong>Essential Vitamins:</strong> Prenatal vitamins typically include folic acid, iron, calcium, and DHA (an omega-3 fatty acid) to support brain development and overall health.</li>
            </ul>

            <h3>3. Mental and Emotional Health</h3>
            <p><strong>Managing Stress:</strong></p>
            <ul>
              <li><strong>Relaxation Techniques:</strong> Incorporate stress-reducing practices such as meditation, deep breathing exercises, and prenatal massage.</li>
            </ul>
            <p><strong>Support Systems:</strong></p>
            <ul>
              <li><strong>Counseling:</strong> Professional counseling or therapy can be beneficial for managing anxiety, depression, or adjusting to the changes of pregnancy.</li>
            </ul>

            <h3>4. Environmental Safety</h3>
            <p><strong>Home Safety:</strong></p>
            <ul>
              <li><strong>Safe Nursery:</strong> Ensure the nursery is free from potential hazards, such as sharp objects or toxic substances. Use safety locks and covers to protect from accidents.</li>
            </ul>
            <p><strong>Avoiding Environmental Hazards:</strong></p>
            <ul>
              <li><strong>Chemical Exposure:</strong> Limit exposure to cleaning products with harsh chemicals, and opt for non-toxic alternatives. Ventilate the home well and use air purifiers if needed.</li>
            </ul>

            <h3>5. Postpartum Care</h3>
            <p><strong>Monitoring Health:</strong></p>
            <ul>
              <li><strong>Recovery:</strong> Monitor for signs of postpartum complications, including infection or severe pain. Follow up with healthcare providers as recommended.</li>
              <li><strong>Physical Recovery:</strong> Allow time for physical healing from childbirth, which may include managing soreness, recovering from any stitches, and dealing with postpartum bleeding.</li>
            </ul>
            <p><strong>Seeking Help:</strong></p>
            <ul>
              <li><strong>Postpartum Depression:</strong> Be aware of symptoms such as persistent sadness, anxiety, or trouble bonding with the baby. Seek professional help if these symptoms occur.</li>
            </ul>
          </div>
        </div>

      {/* Related News Section */}
      <div className="library-content-related-news">
        <div className="library-content-related-header">
          <h2>Related News</h2>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg2.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Pregnancy Safety</div>
            <h3>Mental and Emotional Health During Pregnancy: Strategies for a Positive Experience</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Pregnancy Safety</div>
            <h3>Postpartum Care: Ensuring Health and Recovery After Birth</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Pregnancy Safety</div>
            <h3>Medication and Supplements During Pregnancy: What You Need to Know</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Library5;
