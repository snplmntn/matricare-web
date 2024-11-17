import React, { useState, useEffect } from "react";
import "../../styles/library/article.css";
import { IoBookmark, IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";
import { useParams, useNavigate } from "react-router-dom";

const Article = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const userID = getCookie("userID");
  const [article, setArticle] = useState();
  const [savedArticles, setSavedArticles] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isSavedComponent, setIsSaved] = useState();
  const [lastRead, setLastRead] = useState([]);

  const handleBack = (e) => {
    navigate(-1);
  };

  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");

  const handleToggleSave = async () => {
    if (!isSavedComponent) {
      try {
        const response = await axios.get(
          `${API_URL}/user/save?userId=${userID}&articleId=${article._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setIsSaved(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await axios.delete(
          `${API_URL}/user/unsave?userId=${userID}&articleId=${article._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setIsSaved(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-PH", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  useEffect(() => {
    const savedLastRead = JSON.parse(localStorage.getItem("lastRead")) || [];
    setLastRead(savedLastRead);

    async function fetchArticle() {
      try {
        const response = await axios.get(
          `${API_URL}/article?id=${bookId}`,

          {
            headers: {
              Authorization: token,
            },
          }
        );
        setArticle(response.data.article);
        const approvedRelatedArticles = response.data.relatedArticles.filter(
          (relatedArticle) => relatedArticle.status === "Approved"
        );
        setRelatedArticles(approvedRelatedArticles);
      } catch (error) {
        console.error(error);
      }
    }

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
        setIsSaved(
          response.data.other.savedArticle
            .map((saved) => saved._id)
            .includes(bookId)
        );
      } catch (error) {
        console.error(error);
      }
    }

    fetchArticle();
    fetchSavedArticle();
  }, [bookId]);

  const handleBookClick = (book) => {
    const updatedLastRead = [
      book,
      ...lastRead.filter((b) => b._id !== book._id),
    ];
    setLastRead(updatedLastRead);

    // Save the updated last read list to local storage
    localStorage.setItem("lastRead", JSON.stringify(updatedLastRead));

    navigate(`/book/${book._id}`);
  };

  return (
    <div className="library-content-container">
      <button onClick={handleBack} className="library-back-button">
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
                  article,
                })
              }
            >
              <IoBookmark />
              {isSavedComponent ? "Saved" : "Save to Library"}
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
            <div
              dangerouslySetInnerHTML={{
                __html: article.content && JSON.parse(article.content),
              }}
            />
          )}
        </div>
      </div>

      {/* Related News Section */}
      <div className="library-content-related-news">
        <div className="library-content-related-header">
          <h2>Related Articles</h2>
        </div>

        {relatedArticles.map((relatedArticle) => (
          <div
            key={relatedArticle._id}
            className="library-content-news-card"
            onClick={() => handleBookClick(relatedArticle)}
          >
            <img src={relatedArticle.picture} alt="Related news" />
            <div className="library-content-news-card-content">
              <div className="library-content-news-tag">
                {relatedArticle.category}
              </div>
              <h3>{relatedArticle.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Article;
