import React, { useState, useEffect } from "react";
import "../../styles/library/library1.css";
import { IoBookmark, IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

const Library1 = ({ article }) => {
  const [savedArticles, setSavedArticles] = useState([]);

  const handleReload = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");

  const handleToggleSave = (article) => {
    const updatedArticles = savedArticles.filter(
      (a) => a.title !== article.title
    );

    if (updatedArticles.length === savedArticles.length) {
      // Add more properties when saving the article (date, reviewer)
      const articleToSave = {
        title: article.title,
        image: article.picture || "/img/topic1.jpg",
        date: formatDate(article.createdAt) || "11/30/2019",
        reviewer: article.reviewedBy || "Dra. Donna Jill A. Tungol",
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div className="library-content-container">
      <button onClick={handleReload} className="library-back-button">
        <IoArrowBack />
      </button>

      <div className="library-content-main-news">
        <div className="library-content-news-title-actions">
          <h1 className="library-content-news-title">
            {article && article.fullTitle}
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
          Medically Reviewed by: {article && article.reviewedBy}
        </p>
        <p className="library-content-news-date">
          {article && formatDate(article.createdAt)}
        </p>
        <div className="library-content-news-description">
          {article && (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
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
