import React, { useState, useEffect } from "react";
import "../../styles/library/library1.css";
import { Link } from "react-router-dom";
import { IoBookmark } from "react-icons/io5";

const Library1 = () => {
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
      // Add more properties when saving the article (date, reviewer)
      const articleToSave = {
        title: article.title,
        image: article.image || "/img/topic1.jpg",
        date: article.date || "11/30/2019",
        reviewer: article.reviewer || "Dra. Donna Jill A. Tungol",
      };

      updatedArticles.push(articleToSave);
    }

    // Update state and local storage
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
            Stages of Pregnancy: First, Second and Third Trimester
          </h1>
          <div className="library-content-news-actions">
            <button
              className="library-content-save-btn"
              onClick={() =>
                handleToggleSave({
                  title:
                    "Stages of Pregnancy: First, Second and Third Trimester",
                  image: "/img/topic1.jpg",
                  date: "11/30/2019",
                  reviewer: "Dra. Donna Jill A. Tungol",
                })
              }
            >
              <IoBookmark />
              {isArticleSaved(
                "Stages of Pregnancy: First, Second and Third Trimester"
              )
                ? "Saved"
                : "Save to Library"}
            </button>
          </div>
        </div>
        <p className="library-content-news-details">
          Medically Reviewed by: Dra. Donna Jill A. Tungol
        </p>
        <p className="library-content-news-date">11/30/2019</p>
        <div className="library-content-news-description">
          <h2>First Trimester (Weeks 1-12)</h2>
          <p>
            The first trimester marks the beginning of pregnancy and is crucial
            for the initial development of the fetus. It begins from the first
            day of the last menstrual period (LMP) and lasts until the end of
            week 12.
          </p>
          <p>
            <strong>Key Developments:</strong>
          </p>
          <ul>
            <li>
              <strong>Weeks 1-4:</strong> Conception occurs around two weeks
              after the LMP. The fertilized egg implants into the uterine
              lining, and early cell division begins. The embryo starts forming
              essential structures, and the placenta begins developing.
            </li>
            <li>
              <strong>Weeks 5-8:</strong> Major organs and systems begin
              forming, including the heart, brain, spinal cord, and digestive
              system. Limb buds appear, and facial features start to develop.
              The embryo is now called a fetus.
            </li>
            <li>
              <strong>Weeks 9-12:</strong> The fetus’s organs continue to
              mature. The arms and legs become more defined, and the fetus can
              move, although it’s too small for the mother to feel. By the end
              of this trimester, the fetus has distinct human features and is
              about 2-3 inches long.
            </li>
          </ul>
          <p>
            <strong>Common Symptoms:</strong>
          </p>
          <ul>
            <li>Nausea and vomiting (morning sickness)</li>
            <li>Fatigue</li>
            <li>Frequent urination</li>
            <li>Tender and swollen breasts</li>
            <li>Mood swings</li>
            <li>Food aversions or cravings</li>
          </ul>

          <h2>Second Trimester (Weeks 13-26)</h2>
          <p>
            The second trimester is often considered the most comfortable phase
            of pregnancy for many women. It covers weeks 13 through 26 and is
            marked by continued fetal development and maternal changes.
          </p>
          <p>
            <strong>Key Developments:</strong>
          </p>
          <ul>
            <li>
              <strong>Weeks 13-16:</strong> The fetus grows rapidly, developing
              more recognizable features such as eyebrows, eyelashes, and nails.
              The gender may be detectable via ultrasound. The mother might
              start feeling the baby’s movements (quickening).
            </li>
            <li>
              <strong>Weeks 17-20:</strong> The fetus’s movements become more
              pronounced, and organs such as the liver and kidneys start
              functioning. The fetus develops a layer of fine hair called
              lanugo, and its skin becomes covered with a protective coating
              called vernix.
            </li>
            <li>
              <strong>Weeks 21-26:</strong> The fetus continues to grow and
              develop, gaining weight and length. The lungs mature, and the
              fetus begins practicing breathing movements. By the end of this
              trimester, the fetus is about 14 inches long and weighs around 2
              pounds.
            </li>
          </ul>
          <p>
            <strong>Common Symptoms:</strong>
          </p>
          <ul>
            <li>Reduced nausea and fatigue</li>
            <li>Noticeable weight gain</li>
            <li>Growing belly and breasts</li>
            <li>Stretch marks</li>
            <li>Backaches and leg cramps</li>
            <li>Nasal congestion and bleeding gums</li>
          </ul>

          <h2>Third Trimester (Weeks 27-40)</h2>
          <p>
            The third trimester is the final phase of pregnancy, lasting from
            week 27 until birth. It is characterized by significant fetal growth
            and preparation for birth.
          </p>
          <p>
            <strong>Key Developments:</strong>
          </p>
          <ul>
            <li>
              <strong>Weeks 27-32:</strong> The fetus’s organs mature further,
              and it begins to store fat, which helps with temperature
              regulation after birth. The fetus’s movements become more
              pronounced, and the baby’s brain and lungs continue to develop.
            </li>
            <li>
              <strong>Weeks 33-36:</strong> The fetus’s bones harden, although
              the skull remains soft to facilitate delivery. The baby’s position
              may shift into the head-down position in preparation for birth.
              The mother may experience increased discomfort and pressure.
            </li>
            <li>
              <strong>Weeks 37-40:</strong> The fetus is considered full-term by
              37 weeks. It continues to gain weight and prepare for life outside
              the womb. The baby’s lungs are fully developed, and it begins to
              drop lower into the pelvis (lightening) in preparation for labor.
            </li>
          </ul>
          <p>
            <strong>Common Symptoms:</strong>
          </p>
          <ul>
            <li>Increased abdominal size and pressure</li>
            <li>Frequent urination and difficulty sleeping</li>
            <li>Braxton Hicks contractions (false labor)</li>
            <li>Back pain and pelvic discomfort</li>
            <li>Swelling of feet and ankles</li>
            <li>Colostrum production (early milk)</li>
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
            <div className="library-content-news-tag">Physical Health</div>
            <h3>Physical Changes in Each Trimester</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg5.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">First-time Moms</div>
            <h3>Lifestyle Adjustments and Self-Care</h3>
          </div>
        </div>

        <div className="library-content-news-card">
          <img src="img/bg6.jpg" alt="Related news" />
          <div className="library-content-news-card-content">
            <div className="library-content-news-tag">Healthcare</div>
            <h3>Nutritional Needs and Diet</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library1;
