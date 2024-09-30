import React, { useState, useEffect } from 'react';
import '../../styles/library/library8.css'
import { IoBookmark, IoShareSocial } from 'react-icons/io5'; 

const Library8 = () => {
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
        image: article.image || '/img/pic1.jpg',  
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
        <h1 className="library-content-news-title">Welcoming Your Newborn: Key Advice for the First Days at Home</h1>
        <div className="library-content-news-actions">  
        <button
              className="library-content-save-btn"
              onClick={() => handleToggleSave({
                title: 'Welcoming Your Newborn: Key Advice for the First Days at Home',
                image: '/img/pic1.jpg',
                date: '11/30/2019',
                reviewer: 'Dra. Donna Jill A. Tungol'
              })}
            >
              <IoBookmark /> 
              {isArticleSaved('Welcoming Your Newborn: Key Advice for the First Days at Home') 
                ? 'Saved' 
                : 'Save to Library'}
            </button>
          <button className="library-content-share-btn"><IoShareSocial /> Share on media</button>
        </div>
      </div>
      <p className="library-content-news-details">Medically Reviewed by: Dra. Donna Jill A. Tungol </p>
      <p className="library-content-news-date">11/30/2019</p>
      <div className="library-content-news-description">
          <h2>Baby’s First Days at Home</h2>
          <p>Welcoming a newborn into your home is a profound and life-changing experience. The initial days with your baby are filled with learning, adjustment, and bonding. Here’s a comprehensive guide to help you navigate this special time:</p>

          <h3>1. Preparing the Home Environment</h3>
          <p><strong>Creating a safe and comfortable environment</strong> for your baby is crucial. Ensure the nursery is well-prepared with a crib or bassinet that meets safety standards, a firm mattress, and fitted sheets. Keep the room temperature between 68-72°F (20-22°C) to maintain comfort. Consider adding a white noise machine to help your baby sleep better, and ensure all baby products are safe and free from choking hazards.</p>

          <h3>2. Establishing Feeding Routines</h3>
          <p><strong>Feeding your baby</strong> is a central aspect of their early days. Whether breastfeeding or bottle-feeding, try to establish a routine that works for both you and your baby. For breastfeeding, consider using a comfortable chair with good back support and a nursing pillow. For formula feeding, prepare bottles ahead of time and follow proper sterilization procedures. Pay attention to your baby's hunger cues and try to feed on demand to ensure they are getting enough nourishment.</p>

          <h3>3. Understanding Sleep Needs</h3>
          <p><strong>Newborns</strong> typically sleep 16-18 hours a day, often in short bursts. Create a soothing sleep environment by dimming lights, playing gentle lullabies, and using a white noise machine. Follow safe sleep practices by placing your baby on their back to sleep, on a firm mattress, and avoiding loose bedding or soft toys in the crib. Establishing a bedtime routine can also help signal to your baby that it’s time to sleep.</p>

          <h3>4. Diapering and Hygiene</h3>
          <p><strong>Diapering</strong> is a frequent task, with newborns needing changes every 2-3 hours. Prepare a well-stocked changing station with diapers, wipes, and diaper cream to prevent rashes. During diaper changes, gently clean the diaper area and allow it to dry before putting on a new diaper. Monitor your baby's skin for any signs of irritation and address diaper rash promptly with a barrier cream.</p>

          <h3>5. Bathing and Skincare</h3>
          <p><strong>Bathing</strong> should be gentle and infrequent in the early days. For the first few weeks, give sponge baths using a soft washcloth and mild baby soap until the umbilical cord stump falls off. After that, you can transition to tub baths. Be sure to keep the bath area warm and have everything you need within arm's reach. Pat your baby dry with a soft towel and apply a gentle baby lotion if desired.</p>

          <h3>6. Monitoring Health and Development</h3>
          <p><strong>Tracking your baby’s health</strong> is essential during the first days at home. Keep a record of feedings, diaper changes, and sleep patterns to monitor your baby's well-being. Watch for signs of illness such as fever, difficulty breathing, or abnormal skin color. Schedule and attend pediatrician appointments to ensure your baby is growing and developing appropriately. Be vigilant about vaccination schedules and growth milestones.</p>

          <h3>7. Seeking Support and Managing Stress</h3>
          <p><strong>Adjusting to life with a newborn</strong> can be overwhelming. Seek support from family, friends, or parenting groups to share experiences and advice. Consider hiring a postpartum doula if you need additional help. It’s important to care for your own mental and physical health as well. Ensure you get adequate rest, eat nutritious meals, and take time for self-care. Don't hesitate to reach out for professional help if you experience postpartum depression or anxiety.</p>

          <h3>8. Bonding with Your Baby</h3>
          <p><strong>Bonding</strong> is a critical part of the early days. Engage in skin-to-skin contact, talk to your baby, and respond promptly to their needs. Creating a nurturing and loving environment helps foster emotional security and strengthens the parent-child relationship. Use this time to explore different ways of soothing and interacting with your baby, and enjoy the early moments of your new family dynamic.</p>

          <p>The first days at home with a new baby are a time of significant change and adjustment. Embrace this period with patience and flexibility, and remember that each day will bring new joys and challenges as you adapt to your new role as a parent.</p>
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
            <div className="library-content-news-tag">Baby’s First Days</div>
            <h3>Understanding and Managing Newborn Sleep Patterns: Tips for the First Few Weeks</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Baby’s First Days</div>
            <h3>Newborn Care Basics: Bathing, Diapering, and Dressing Your Baby</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Baby’s First Days</div>
            <h3>Establishing a Routine: How to Create a Daily Schedule for You and Your Newborn</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Library8;
