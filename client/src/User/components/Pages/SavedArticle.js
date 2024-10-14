import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../../styles/pages/savedarticle.css";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

const SavedArticle = () => {
  const userID = getCookie("userID");
  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedArticles")) || [];

    async function fetchSavedArticle() {
      try {
        const response = await axios.get(
          `${API_URL}/user?userId=${userID}`,

          {
            headers: {
              Authorization: token,
            },
          }
        );
        setSavedArticles(response.data.other.savedArticle);
        console.log(response.data.other.savedArticle);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSavedArticle();
  }, []);

  const handleToggleSave = (article) => {
    const updatedArticles = savedArticles.filter(
      (a) => a.title !== article.title
    );

    if (updatedArticles.length === savedArticles.length) {
      updatedArticles.push(article);
    }

    setSavedArticles(updatedArticles);
    localStorage.setItem("savedArticles", JSON.stringify(updatedArticles));
  };

  const handleArticleClick = (article) => {
    // Handle when an article is clicked (e.g., redirect to full article)
    console.log("Redirecting to article:", article.title);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div className="saved-articles-layout">
      <div className="saved-articles-main-content">
        <section id="saved-articles-section" className="saved-articles-section">
          <h2>Saved Articles</h2>
          <div className="saved-article-list-container">
            {savedArticles.length === 0 ? (
              <p>No saved articles yet.</p>
            ) : (
              savedArticles.map((article, index) => (
                <div
                  key={index}
                  className="saved-article-item"
                  onClick={() => handleArticleClick(article)}
                >
                  <img
                    src={article.picture}
                    alt={article.title}
                    className="article-cover"
                  />
                  <div className="article-details">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-date">
                      Published on: {formatDate(article.createdAt)}
                    </p>
                    <p className="article-reviewer">
                      Reviewed by: {article.reviewedBy}
                    </p>
                  </div>
                  <button
                    className="unsave-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSave(article);
                    }}
                  >
                    {savedArticles.find((a) => a.title === article.title)
                      ? "Unsave"
                      : "Save"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SavedArticle;
