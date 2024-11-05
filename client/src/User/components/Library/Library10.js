import React, { useState, useEffect } from "react";
import "../../styles/library/library10.css";
import { IoBookmark, IoShareSocial } from "react-icons/io5";

const Library10 = () => {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedArticles")) || [];
    setSavedArticles(saved);
  }, []);

  const handleToggleSave = (article) => {
    const updatedArticles = savedArticles.filter(
      (a) => a.title !== article.title
    );

    if (updatedArticles.length === savedArticles.length) {
      const articleToSave = {
        title: article.title,
        image: article.image || "/img/article1.webp",
        date: article.date || "11/30/2019",
        reviewer: article.reviewer || "Dra. Donna Jill A. Tungol",
      };

      updatedArticles.push(articleToSave);
    }

    setSavedArticles(updatedArticles);
    localStorage.setItem("savedArticles", JSON.stringify(updatedArticles));
  };

  const isArticleSaved = (articleTitle) => {
    return savedArticles.some((article) => article.title === articleTitle);
  };

  return (
    <div className="library-content-container">
      <div className="library-content-main-news">
        <div className="library-content-news-title-actions">
          <h1 className="library-content-news-title">
            Preparing for Breastfeeding: What You Need to Know
          </h1>
          <div className="library-content-news-actions">
            <button
              className="library-content-save-btn"
              onClick={() =>
                handleToggleSave({
                  title: "Preparing for Breastfeeding: What You Need to Know",
                  image: "/img/article1.webp",
                  date: "11/30/2019",
                  reviewer: "Dra. Donna Jill A. Tungol",
                })
              }
            >
              <IoBookmark />
              {isArticleSaved(
                "Preparing for Breastfeeding: What You Need to Know"
              )
                ? "Saved"
                : "Save to Library"}
            </button>
            <button className="library-content-share-btn">
              <IoShareSocial /> Share on media
            </button>
          </div>
        </div>
        <p className="library-content-news-details">
          Medically Reviewed by: Dra. Donna Jill A. Tungol{" "}
        </p>
        <p className="library-content-news-date">11/30/2019</p>
        <div className="library-content-news-description">
          <h2>Why Breastfeeding is Important</h2>
          <p>
            Breastfeeding provides essential nutrients and antibodies that
            protect babies from infections and illnesses. It's a unique bonding
            experience between the mother and the baby, promoting emotional
            connection, and has long-lasting health benefits for both.
          </p>

          <h2>Preparing Physically and Mentally</h2>
          <p>
            Before the baby arrives, it's important to prepare both physically
            and mentally for breastfeeding. Here are some tips to help mothers
            get ready:
          </p>
          <ul>
            <li>
              <strong>Breastfeeding Classes:</strong> Attend a class or workshop
              on breastfeeding to learn about proper latching, positions, and
              what to expect during the first few weeks.
            </li>
            <li>
              <strong>Breast Care:</strong> During pregnancy, your breasts will
              grow and prepare to produce milk. Make sure to wear comfortable
              bras and moisturize your skin to prevent soreness.
            </li>
            <li>
              <strong>Build a Support System:</strong> Talk to your partner,
              family, or friends about your decision to breastfeed. Having a
              support system will help you overcome any challenges.
            </li>
          </ul>

          <h2>Common Breastfeeding Challenges</h2>
          <p>
            Breastfeeding may not always be easy in the beginning, and some
            challenges may arise. Here are common difficulties and ways to
            address them:
          </p>
          <ul>
            <li>
              <strong>Latch Issues:</strong> Some babies may have trouble
              latching. Seek help from a lactation consultant to guide you on
              achieving a comfortable and effective latch.
            </li>
            <li>
              <strong>Engorgement:</strong> When your milk comes in, your
              breasts may become engorged. Apply warm compresses and gently
              massage your breasts before feeding to relieve discomfort.
            </li>
            <li>
              <strong>Sore Nipples:</strong> Sore nipples can occur, especially
              in the first few weeks. Ensure your baby is latching properly and
              use nipple cream to soothe soreness.
            </li>
            <li>
              <strong>Low Milk Supply:</strong> Sometimes mothers worry about
              not producing enough milk. Frequent nursing, staying hydrated, and
              resting can help increase milk supply.
            </li>
          </ul>

          <h2>Breastfeeding in Public</h2>
          <p>
            Many new mothers feel uncertain about breastfeeding in public.
            Remember, it's your right to feed your baby wherever and whenever
            they are hungry.
          </p>
          <ul>
            <li>Wear nursing-friendly clothing for easy access.</li>
            <li>Use a nursing cover if you prefer privacy.</li>
            <li>
              Know your legal rights—many countries protect the right to
              breastfeed in public.
            </li>
          </ul>

          <h2>Breast Pumping and Milk Storage</h2>
          <p>
            For mothers who plan to return to work or need to be away from their
            baby for a period, pumping is an excellent way to continue providing
            breast milk.
          </p>
          <ul>
            <li>
              <strong>Choosing a Breast Pump:</strong> Select a breast pump that
              meets your needs, whether it’s a manual or electric pump.
            </li>
            <li>
              <strong>Storage Guidelines:</strong> Store expressed breast milk
              in clean containers. Freshly expressed milk can be stored in the
              refrigerator for up to 4 days and in the freezer for up to 6
              months.
            </li>
            <li>
              <strong>Creating a Pumping Schedule:</strong> Pump at regular
              intervals to maintain your milk supply, mimicking your baby's
              feeding schedule as much as possible.
            </li>
          </ul>

          <h2>Weaning</h2>
          <p>
            Weaning is the gradual process of replacing breastfeeding with other
            sources of nutrition. Every mother and baby will experience weaning
            differently, and it’s important to follow the baby’s cues.
          </p>
          <ul>
            <li>
              <strong>Signs of Readiness:</strong> Babies may show interest in
              solid foods around 6 months of age. Gradually introduce new foods
              while continuing to breastfeed.
            </li>
            <li>
              <strong>Slow Weaning:</strong> Slowly reduce breastfeeding
              sessions, one at a time, to make the transition easier for both
              you and your baby.
            </li>
            <li>
              <strong>Comforting Your Baby:</strong> Offer plenty of cuddles and
              comfort during weaning to ease any anxiety your baby may feel from
              the reduced breastfeeding time.
            </li>
          </ul>
        </div>
      </div>

      {/* Related News Section */}
      <div className="library-content-related-news">
        <div className="library-content-related-header">
          <h2>Related Articles</h2>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg2.jpg" alt="Related article" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Breastfeeding</div>
            <h3>How to Choose the Right Breast Pump</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related article" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Breastfeeding</div>
            <h3>Navigating the Early Days of Motherhood</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related article" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Breastfeeding</div>
            <h3>Postpartum Recovery: What to Expect</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library10;
