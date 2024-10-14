import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../../styles/pages/savedarticle.css";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

const SavedArticle = () => {
  const navigate = useNavigate();
  const userID = getCookie("userID");
  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const [savedArticles, setSavedArticles] = useState([]);
  const [lastRead, setLastRead] = useState([]);

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
      } catch (error) {
        console.error(error);
      }
    }
    fetchSavedArticle();
  }, []);

  const handleUnsave = async (article) => {
    try {
      const response = await axios.delete(
        `${API_URL}/user/unsave?userId=${userID}&articleId=${article._id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSavedArticles(savedArticles.filter((a) => a._id !== article._id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleArticleClick = (book) => {
    const updatedLastRead = [
      book,
      ...lastRead.filter((b) => b._id !== book._id),
    ];
    setLastRead(updatedLastRead);

    // Save the updated last read list to local storage
    localStorage.setItem("lastRead", JSON.stringify(updatedLastRead));

    navigate(`/book/${book._id}`);
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
                      handleUnsave(article);
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
