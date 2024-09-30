import React, { useState, useEffect } from 'react';
import '../../styles/library/library3.css'
import { IoBookmark, IoShareSocial } from 'react-icons/io5'; 

const Library3 = () => {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedArticles')) || [];
    setSavedArticles(saved);
  }, []);

  const handleToggleSave = (article) => {
    const updatedArticles = savedArticles.filter(a => a.title !== article.title);

    if (updatedArticles.length === savedArticles.length) {
      // Add more properties when saving the article (date, reviewer)
      const articleToSave = {
        title: article.title,
        image: article.image || '/img/topic3.jpg',  
        date: article.date || '11/30/2019', 
        reviewer: article.reviewer || 'Dra. Donna Jill A. Tungol'
      };

      updatedArticles.push(articleToSave);
    }

    // Update state and local storage
    setSavedArticles(updatedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
  };

  const isArticleSaved = (articleTitle) => {
    return savedArticles.some(article => article.title === articleTitle);
  };

  return (
    <div className="library-content-container">
  <div className="library-content-main-news">
      <div className="library-content-news-title-actions">
        <h1 className="library-content-news-title">Staying Active: Fitness Tips for Every Stage of Pregnancy</h1>
        <div className="library-content-news-actions">  
          <button
              className="library-content-save-btn"
              onClick={() => handleToggleSave({
                title: 'Staying Active: Fitness Tips for Every Stage of Pregnancy',
                image: '/img/topic3.jpg',
                date: '11/30/2019',
                reviewer: 'Dra. Donna Jill A. Tungol'
              })}
            >
              <IoBookmark /> 
              {isArticleSaved('Staying Active: Fitness Tips for Every Stage of Pregnancy') 
                ? 'Saved' 
                : 'Save to Library'}
            </button>
          <button className="library-content-share-btn"><IoShareSocial /> Share on media</button>
        </div>
      </div>
      <p className="library-content-news-details">Medically Reviewed by: Dra. Donna Jill A. Tungol </p>
      <p className="library-content-news-date">11/30/2019</p>
      <div className="library-content-news-description">
            <h2>Pregnancy Fitness</h2>
            <p>Staying physically active during pregnancy offers numerous benefits, including improved mood, better sleep, enhanced stamina, and reduced risk of complications. Pregnancy fitness involves adapting exercise routines to accommodate a growing body and prioritize both maternal and fetal well-being.</p>

            <h3>1. Benefits of Exercise During Pregnancy</h3>
            <p>Exercising during pregnancy can enhance physical and emotional well-being, leading to a healthier pregnancy and postpartum recovery. Key benefits include:</p>
            <ul>
              <li><strong>Improved Circulation:</strong> Regular physical activity can enhance blood flow, reducing swelling and preventing conditions like varicose veins.</li>
              <li><strong>Boosted Mood:</strong> Exercise triggers the release of endorphins, which can help alleviate stress, anxiety, and pregnancy-related mood swings.</li>
              <li><strong>Better Sleep:</strong> Many pregnant women experience sleep disturbances, but exercise can promote better sleep quality.</li>
              <li><strong>Reduced Risk of Gestational Diabetes:</strong> Staying active helps regulate blood sugar levels, lowering the risk of gestational diabetes.</li>
              <li><strong>Easier Labor and Delivery:</strong> Stronger muscles and better cardiovascular health can contribute to a smoother labor process and faster recovery.</li>
              <li><strong>Weight Management:</strong> Exercise helps maintain a healthy weight during pregnancy, preventing excessive weight gain, which can lead to complications.</li>
            </ul>

            <h3>2. Safe Exercises for Pregnancy</h3>
            <p>While staying active during pregnancy is encouraged, certain modifications are necessary to ensure safety. Suitable exercises include:</p>
            <ul>
              <li><strong>Walking:</strong> A low-impact exercise that boosts cardiovascular health without placing undue stress on the body.</li>
              <li><strong>Swimming:</strong> One of the safest exercises during pregnancy, swimming supports the weight of the body, reduces strain on joints, and improves endurance.</li>
              <li><strong>Prenatal Yoga:</strong> Yoga enhances flexibility, balance, and mental clarity while promoting relaxation. It also prepares the body for labor with breathing and stretching techniques.</li>
              <li><strong>Stationary Biking:</strong> Cycling on a stationary bike avoids balance issues and keeps the heart rate up while protecting the joints.</li>
              <li><strong>Low-Impact Aerobics:</strong> Aerobic exercises designed for pregnant women focus on improving stamina and strength without intense physical strain.</li>
              <li><strong>Strength Training:</strong> Light weightlifting can build muscle strength, particularly in the arms, back, and legs, helping prepare for the physical demands of carrying a baby and labor.</li>
            </ul>

            <h3>3. Exercise Modifications for Each Trimester</h3>
            <p>As pregnancy progresses, fitness routines should evolve to accommodate the body’s changes:</p>
            <ul>
              <li><strong>First Trimester:</strong> Women can usually maintain their pre-pregnancy exercise routines, with modifications for comfort. Avoid exercises that involve lying on the stomach or high-impact activities that could cause abdominal trauma.</li>
              <li><strong>Second Trimester:</strong> As the belly grows, exercises that strain the back or require lying flat should be avoided. Low-impact activities, like swimming or walking, are ideal. Prenatal yoga and stretching help maintain flexibility and reduce tension.</li>
              <li><strong>Third Trimester:</strong> In the final stages of pregnancy, balance may become an issue, so exercises like stationary biking or swimming are safer options. Gentle stretching, yoga, and strength training with light weights can help maintain mobility and endurance.</li>
            </ul>

            <h3>4. Precautions and Warning Signs</h3>
            <p>While exercise is beneficial, there are important precautions to consider:</p>
            <ul>
              <li><strong>Consult with a Healthcare Provider:</strong> Before starting or continuing an exercise routine, it’s essential to consult with a healthcare provider to ensure the fitness plan aligns with personal health needs.</li>
              <li><strong>Stay Hydrated:</strong> Pregnant women should drink plenty of water before, during, and after exercise to avoid dehydration.</li>
              <li><strong>Avoid Overheating:</strong> Exercising in a cool environment is crucial, as overheating can negatively affect the fetus.</li>
              <li><strong>Listen to the Body:</strong> If any discomfort, dizziness, shortness of breath, or pain occurs during exercise, stop immediately and consult a healthcare provider.</li>
              <li><strong>Avoid High-Risk Activities:</strong> Activities that involve a high risk of falling, contact sports, or exercises that could cause abdominal trauma should be avoided.</li>
            </ul>

            <h3>5. Pelvic Floor Exercises</h3>
            <p>Strengthening the pelvic floor is especially important during pregnancy, as it supports the growing uterus, bladder, and bowels. Pelvic floor exercises, such as Kegels, help maintain muscle tone in this area, reducing the risk of incontinence and promoting better recovery after childbirth.</p>

            <h3>6. Postpartum Fitness</h3>
            <p>After giving birth, it’s essential to ease back into fitness. Postpartum recovery can vary, so it’s crucial to start with gentle exercises, such as walking or pelvic floor strengthening, before gradually resuming more intense activities. Consulting a healthcare provider before restarting vigorous exercise is recommended, especially after a cesarean section or complicated delivery.</p>

            <h3>7. Exercise Myths in Pregnancy</h3>
            <p>There are several myths surrounding exercise during pregnancy, such as:</p>
            <ul>
              <li><strong>Myth 1: You Should Avoid Exercise Entirely:</strong> Many women think that exercise is unsafe during pregnancy, but with proper guidance, staying active can be highly beneficial.</li>
              <li><strong>Myth 2: Heart Rate Should Never Exceed 140 Beats Per Minute:</strong> There is no strict rule about heart rate in pregnancy; instead, pregnant women should focus on staying in tune with their bodies and avoiding overexertion.</li>
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
            <div className="library-content-news-tag">Pregnancy Fitness</div>
            <h3>Physical Changes in Each Trimester</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Pregnancy Fitness</div>
            <h3>Lifestyle Adjustments and Self-Care</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Pregnancy Fitness</div>
            <h3>Nutritional Needs and Diet</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Library3;
