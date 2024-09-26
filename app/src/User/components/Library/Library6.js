import React from 'react';
import '../../styles/library/library6.css'
import { IoBookmark, IoShareSocial } from 'react-icons/io5'; 

const Library6 = () => {
  return (
    <div className="library-content-container">
  <div className="library-content-main-news">
      <div className="library-content-news-title-actions">
        <h1 className="library-content-news-title">Understanding Pregnancy Symptoms: What to Expect</h1>
        <div className="library-content-news-actions">  
          <button className="library-content-save-btn"><IoBookmark /> Save to Library </button>
          <button className="library-content-share-btn"><IoShareSocial /> Share on media</button>
        </div>
      </div>
      <p className="library-content-news-details">Medically Reviewed by: Dra. Donna Jill A. Tungol </p>
      <p className="library-content-news-date">11/30/2019 08:33 PM EST</p>
      <div className="library-content-news-description">
          <h2>Pregnancy Symptoms</h2>
          <p>Pregnancy brings about numerous changes in a woman's body as it adjusts to support the growing baby. These changes often manifest as various symptoms that can range from mild to severe. Understanding these symptoms can help manage them better and ensure a healthier pregnancy experience. Below are some common pregnancy symptoms, along with explanations to provide further insight:</p>
          
          <ul>
            <li><strong>Nausea and vomiting (morning sickness):</strong> Morning sickness is a common symptom, though it can occur at any time of the day. It is primarily due to hormonal changes, especially increased levels of human chorionic gonadotropin (hCG). Nausea and vomiting usually subside after the first trimester, but some women may experience it longer.</li>
            
            <li><strong>Fatigue:</strong> Feeling unusually tired is a common symptom, particularly during the first and third trimesters. This fatigue occurs because the body is working hard to support the developing embryo, produce additional blood, and undergo hormonal changes. Adequate rest and a balanced diet can help manage this fatigue.</li>
            
            <li><strong>Frequent urination:</strong> As the uterus grows, it exerts pressure on the bladder, leading to more frequent trips to the bathroom. This symptom often becomes more noticeable in the first and third trimesters and can be exacerbated by increased fluid intake.</li>
            
            <li><strong>Tender and swollen breasts:</strong> Hormonal changes cause the breasts to become more sensitive and enlarged. This sensitivity is due to increased blood flow and the preparation of the breasts for breastfeeding. Wearing a supportive bra can help alleviate discomfort.</li>
            
            <li><strong>Mood swings:</strong> Hormonal fluctuations during pregnancy can lead to emotional ups and downs. This can range from irritability and anxiety to heightened emotions. It's important to recognize that mood swings are a normal part of pregnancy, but seeking support from friends, family, or a mental health professional can be beneficial.</li>
            
            <li><strong>Food aversions or cravings:</strong> Pregnancy can alter taste and smell, leading to unusual food preferences or aversions. Some women may crave specific foods or develop aversions to foods they previously enjoyed. These changes are often due to hormonal shifts and can vary widely among individuals.</li>
            
            <li><strong>Reduced nausea and fatigue:</strong> As the pregnancy progresses, many women notice a reduction in early symptoms like nausea and fatigue. This is due to the body adjusting to hormonal changes and the stabilization of early pregnancy hormones. However, some symptoms may persist throughout the pregnancy.</li>
            
            <li><strong>Noticeable weight gain:</strong> Weight gain is a natural part of pregnancy, driven by the growth of the baby, placenta, and amniotic fluid, as well as increased maternal fat stores. Weight gain varies depending on individual health and lifestyle, but it is generally monitored by healthcare providers to ensure it is within a healthy range.</li>
            
            <li><strong>Growing belly and breasts:</strong> As the baby grows, the belly and breasts expand. This physical change can become more apparent in the second trimester and continues through the pregnancy. Wearing comfortable clothing and supportive bras can help accommodate these changes.</li>
            
            <li><strong>Stretch marks:</strong> Stretch marks occur when the skin stretches rapidly to accommodate the growing baby. They commonly appear on the belly, breasts, hips, and thighs. While they may fade over time, using moisturizers and maintaining healthy skin can help minimize their appearance.</li>
            
            <li><strong>Backaches and leg cramps:</strong> As the uterus expands, it can put additional strain on the back and legs. This can lead to backaches and leg cramps, especially as the pregnancy progresses. Practicing good posture, using supportive pillows, and gentle stretching can help alleviate discomfort.</li>
            
            <li><strong>Nasal congestion and bleeding gums:</strong> Hormonal changes during pregnancy can lead to nasal congestion and increased blood flow to the gums, causing them to bleed more easily. Staying hydrated, using saline nasal sprays, and maintaining good oral hygiene can help manage these symptoms.</li>
            
            <li><strong>Increased abdominal size and pressure:</strong> As the baby and uterus grow, they can cause significant abdominal pressure and discomfort. This increased size can lead to feelings of heaviness and pressure, particularly as the due date approaches.</li>
            
            <li><strong>Frequent urination and difficulty sleeping:</strong> The increased size of the uterus can cause frequent urination and make it challenging to find a comfortable sleeping position. Using pillows for support and limiting fluid intake before bed can help improve sleep quality.</li>
            
            <li><strong>Braxton Hicks contractions (false labor):</strong> These irregular contractions are the body's way of preparing for labor. They are usually painless or mildly uncomfortable and can occur throughout the second and third trimesters. Staying hydrated and resting can help reduce the frequency of these contractions.</li>
            
            <li><strong>Back pain and pelvic discomfort:</strong> The weight of the baby and hormonal changes can lead to back pain and pelvic discomfort. Prenatal exercises, maintaining good posture, and using supportive furniture can help manage these symptoms.</li>
            
            <li><strong>Swelling of feet and ankles:</strong> Increased fluid retention can cause swelling in the lower extremities, particularly towards the end of pregnancy. Elevating the feet, staying hydrated, and avoiding prolonged periods of standing can help reduce swelling.</li>
            
            <li><strong>Colostrum production (early milk):</strong> The breasts begin to produce colostrum, a nutrient-rich fluid, in preparation for breastfeeding. Colostrum is typically produced towards the end of pregnancy and may leak from the nipples. Wearing nursing pads can help manage this leakage.</li>
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
            <div className="library-content-news-tag">Pregnancy Symptoms</div>
            <h3>The Impact of Hormonal Changes on Pregnancy Symptoms</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Pregnancy Symptoms</div>
            <h3>When to Seek Medical Advice for Pregnancy Symptoms</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Pregnancy Symptoms</div>
            <h3>Addressing Common Pregnancy Discomforts: Back Pain, Leg Cramps, and More</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Library6;
