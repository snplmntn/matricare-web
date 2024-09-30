import React, { useState, useEffect } from 'react';
import '../../styles/library/library4.css'
import { IoBookmark, IoShareSocial } from 'react-icons/io5'; 

const Library4 = () => {
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
        image: article.image || '/img/topic4.jpg',  
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
        <h1 className="library-content-news-title">Preparing Your Home and Life for a Newborn</h1>
        <div className="library-content-news-actions">  
        <button
              className="library-content-save-btn"
              onClick={() => handleToggleSave({
                title: 'Preparing Your Home and Life for a Newborn',
                image: '/img/topic4.jpg',
                date: '11/30/2019',
                reviewer: 'Dra. Donna Jill A. Tungol'
              })}
            >
              <IoBookmark /> 
              {isArticleSaved('Preparing Your Home and Life for a Newborn') 
                ? 'Saved' 
                : 'Save to Library'}
            </button>
          <button className="library-content-share-btn"><IoShareSocial /> Share on media</button>
        </div>
      </div>
      <p className="library-content-news-details">Medically Reviewed by: Dra. Donna Jill A. Tungol </p>
      <p className="library-content-news-date">11/30/2019 08:33 PM EST</p>
      <div className="library-content-news-description">
      <h2>Preparing for a Baby</h2>
            <p>Preparing for a baby involves both emotional and practical preparations to welcome a newborn into your life. This transformative period requires thoughtful planning to ensure the health, safety, and comfort of both the baby and the parents. Here’s a broad overview of the key aspects of preparing for a baby:</p>

            <h3>1. Health and Prenatal Care</h3>
            <p>Taking care of your health during pregnancy is critical for both the mother and baby’s well-being. This includes:</p>
            <ul>
              <li><strong>Regular Prenatal Checkups:</strong> Visiting a healthcare provider ensures the baby’s growth is monitored, and any complications are addressed early.</li>
              <li><strong>Prenatal Vitamins:</strong> Folic acid, iron, and calcium supplements are typically recommended to support the baby's development.</li>
              <li><strong>Healthy Diet and Hydration:</strong> Eating a balanced diet rich in fruits, vegetables, whole grains, and protein is essential. Staying hydrated and avoiding harmful substances like alcohol and tobacco is crucial.</li>
              <li><strong>Exercise:</strong> Staying physically active with safe prenatal exercises can improve strength and stamina, aid in labor, and enhance overall well-being.</li>
              <li><strong>Mental Health:</strong> Managing stress, anxiety, or depression during pregnancy is equally important, as mental well-being affects both the mother and the baby.</li>
            </ul>

            <h3>2. Setting Up the Nursery</h3>
            <p>Creating a safe and comfortable environment for the baby is a significant step in preparation. Key aspects include:</p>
            <ul>
              <li><strong>Crib and Bedding:</strong> Ensure that the crib meets safety standards, with a firm mattress and fitted sheets. Avoid loose blankets or pillows to reduce the risk of suffocation.</li>
              <li><strong>Changing Area:</strong> Set up a changing station with essentials like diapers, wipes, creams, and changing pads.</li>
              <li><strong>Baby Monitor:</strong> A monitor helps keep an eye on the baby while allowing parents to move around the house.</li>
              <li><strong>Clothing and Essentials:</strong> Stock up on baby clothes, blankets, bibs, and sleepwear, but avoid overbuying since babies outgrow clothes quickly.</li>
              <li><strong>Baby Gear:</strong> Consider items like a stroller, car seat, and baby carrier for mobility.</li>
            </ul>

            <h3>3. Babyproofing the Home</h3>
            <p>Making the home safe for a newborn and eventually a curious toddler is a vital part of preparation. Steps include:</p>
            <ul>
              <li><strong>Securing Furniture:</strong> Anchor heavy furniture, such as bookshelves and dressers, to the wall to prevent tipping.</li>
              <li><strong>Electrical Safety:</strong> Cover electrical outlets with safety plugs and keep cords out of reach.</li>
              <li><strong>Locking Cabinets and Drawers:</strong> Store cleaning supplies, medications, and other hazardous items in locked cabinets.</li>
              <li><strong>Installing Baby Gates:</strong> Use gates to block stairways or rooms that may pose a danger to a baby.</li>
            </ul>

            <h3>4. Financial Planning</h3>
            <p>Welcoming a new baby comes with added financial responsibilities. It’s helpful to:</p>
            <ul>
              <li><strong>Create a Budget:</strong> Plan for baby-related expenses, including medical costs, diapers, formula, baby gear, and childcare.</li>
              <li><strong>Health Insurance:</strong> Ensure that both mother and baby have adequate health insurance coverage. Research maternity leave policies and consider disability or life insurance for added security.</li>
              <li><strong>Savings Plan:</strong> Establish or contribute to a savings fund for the baby’s future, such as education costs or unforeseen medical expenses.</li>
            </ul>

            <h3>5. Emotional Preparation</h3>
            <p>Welcoming a new life brings joy but can also be overwhelming. Preparing emotionally is essential:</p>
            <ul>
              <li><strong>Communication with Partner:</strong> Discuss parenting roles, expectations, and concerns with your partner to strengthen your relationship and work as a team.</li>
              <li><strong>Support System:</strong> Lean on family and friends for support, whether emotional or practical, especially in the early weeks after birth.</li>
              <li><strong>Parenting Education:</strong> Attending prenatal or parenting classes can provide valuable insights into childbirth, newborn care, and breastfeeding.</li>
            </ul>

            <h3>6. Birth Plan and Hospital Preparation</h3>
            <p>Having a birth plan can help ensure that your preferences are known and can make the labor and delivery experience smoother:</p>
            <ul>
              <li><strong>Birth Plan:</strong> Outline your preferences for labor, delivery, and post-birth care. Discuss this plan with your healthcare provider.</li>
              <li><strong>Hospital Bag:</strong> Pack a bag with essentials for the hospital stay, including items for both you and the baby, such as clothing, toiletries, and any necessary documents.</li>
              <li><strong>Postpartum Care:</strong> Plan for postpartum care, including support for physical recovery, mental health, and help with newborn care.</li>
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
            <div className="library-content-news-tag">Preparing for Baby</div>
            <h3>Financial Planning Tips for Expecting Parents</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Preparing for Baby</div>
            <h3>Preparing for Birth: Creating a Birth Plan That Works for You</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Preparing for Baby</div>
            <h3>Understanding Newborn Care: Tips for First-Time Parents</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Library4;
