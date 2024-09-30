import React, { useState, useEffect } from 'react';
import '../../styles/library/library9.css';
import { IoBookmark, IoShareSocial } from 'react-icons/io5';

const Library9 = () => {
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
        image: article.image || '/img/bg5.jpg',
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
          <h1 className="library-content-news-title">Stages of Pregnancy: First, Second and Third Trimester</h1>
          <div className="library-content-news-actions">
            <button
              className="library-content-save-btn"
              onClick={() => handleToggleSave({
                title: 'Essential Pregnancy Safety Measures: Protecting Both Mother and Baby',
                image: '/img/bg5.jpg',
                date: '11/30/2019',
                reviewer: 'Dra. Donna Jill A. Tungol'
              })}
            >
              <IoBookmark />
              {isArticleSaved('Essential Pregnancy Safety Measures: Protecting Both Mother and Baby') 
                ? 'Saved' 
                : 'Save to Library'}
            </button>
            <button className="library-content-share-btn"><IoShareSocial /> Share on media</button>
          </div>
        </div>
        <p className="library-content-news-details">Medically Reviewed by: Dra. Donna Jill A. Tungol</p>
        <p className="library-content-news-date">11/30/2019</p>
        <div className="library-content-news-description">
          <h2>Financial Planning for New Parents</h2>
          <p>Becoming a parent introduces many new responsibilities, and effective financial planning is key to ensuring a stable and secure future for your growing family. Proper preparation can help manage the additional expenses and navigate financial challenges. Here’s a comprehensive overview of important aspects of financial planning for new parents:</p>

          {/* Content sections */}
          <h3>1. Budgeting for a Growing Family</h3>
          <p><strong>Creating a Family Budget:</strong> Establishing a detailed budget helps manage the increased costs associated with having a baby. Include expenses such as baby supplies, medical bills, and potential changes in household income. Tracking your spending and adjusting your budget regularly will help maintain financial stability.</p>

          <h3>2. Understanding Maternity and Paternity Leave Benefits</h3>
          <p><strong>Know Your Benefits:</strong> Review your company's maternity and paternity leave policies, as well as any government-provided benefits. Understanding your entitlements can help you plan for income changes during your time off and ensure you make the most of available resources.</p>

          <h3>3. Building an Emergency Fund</h3>
          <p><strong>Saving for Unexpected Expenses:</strong> An emergency fund provides a financial safety net for unexpected costs such as medical emergencies or job loss. Aim to save three to six months' worth of expenses to cover unforeseen events and maintain peace of mind.</p>

          <h3>4. Navigating Health Insurance and Medical Costs</h3>
          <p><strong>Insurance Coverage:</strong> Ensure that your health insurance covers prenatal care, delivery, and newborn care. Familiarize yourself with the costs associated with your policy, such as deductibles and co-pays, and plan accordingly to manage medical expenses effectively.</p>

          <h3>5. Planning for Your Child’s Education</h3>
          <p><strong>Saving for the Future:</strong> Start planning for your child’s education by exploring savings options like 529 plans. Setting aside money for education early can ease the financial burden when the time comes and take advantage of compound growth.</p>

          <h3>6. Choosing the Right Life Insurance</h3>
          <p><strong>Protecting Your Family:</strong> Life insurance ensures that your family is financially protected in the event of an unexpected loss. Assess your coverage needs and select a policy that provides adequate protection for your family’s future.</p>

          <h3>7. Balancing Retirement Savings with New Expenses</h3>
          <p><strong>Maintaining Retirement Contributions:</strong> Continue to contribute to your retirement savings while managing new expenses. Balancing current financial needs with long-term goals ensures a secure retirement without sacrificing immediate family needs.</p>

          <h3>8. Managing Debt During Parenthood</h3>
          <p><strong>Debt Reduction Strategies:</strong> Develop a plan to manage and reduce debt while budgeting for new expenses. Prioritize paying down high-interest debts and consider consolidating loans to lower monthly payments and ease financial strain.</p>

          <h3>9. Estate Planning for Your Family’s Future</h3>
          <p><strong>Updating Your Estate Plan:</strong> Review and update your will, establish trusts, and designate guardians for your child. Proper estate planning ensures that your assets are managed according to your wishes and that your family is cared for in your absence.</p>

          <h3>10. Maximizing Tax Benefits and Deductions</h3>
          <p><strong>Tax Considerations:</strong> Take advantage of tax benefits available to new parents, such as child tax credits and deductions for childcare expenses. Consult with a tax advisor to optimize your tax situation and ensure you’re receiving all applicable benefits.</p>

          <h3>11. Preparing for Financial Contingencies</h3>
          <p><strong>Insurance and Contingency Plans:</strong> Explore various insurance options and create contingency plans to protect against financial challenges. This includes health, disability, and home insurance, as well as establishing a plan for managing unexpected situations.</p>

          <h3>12. Adjusting Financial Goals with a New Baby</h3>
          <p><strong>Reevaluating Goals:</strong> With the arrival of a new baby, reassess your financial goals and adjust them to accommodate your changing priorities. Setting realistic and achievable goals will help you navigate this new phase of life while staying on track financially.</p>

          <p>Effective financial planning helps new parents manage their finances confidently, ensuring a stable and secure environment for their growing family. By addressing these key areas, you can navigate the financial aspects of parenthood with greater ease and prepare for a successful future.</p>
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
            <div className="library-content-news-tag">Financial Planning</div>
            <h3>Life Insurance for New Parents: Ensuring Your Family’s Financial Security</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Financial Planning</div>
            <h3>Adjusting Your Financial Goals with a New Family Member</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Financial Planning</div>
            <h3>Saving on Baby Essentials: Budget-Friendly Tips for New Parents</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library9;
