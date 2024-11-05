import React, { useState, useEffect } from "react";
import "../../../User/styles/library/article.css";
import { IoArrowBack } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styles
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

const Library1 = ({ article }) => {
  const token = getCookie("token");
  const [content, setContent] = useState(
    article.content && JSON.parse(article.content)
  );
  const [isEditing, setIsEditing] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleReload = (e) => {
    e.preventDefault();
    window.location.reload();
  };

  const handleChange = (value) => {
    setContent(value); // Value contains the HTML or delta format of Quill's content
  };

  const saveToDb = async () => {
    const updatedArticle = {
      content: JSON.stringify(content),
    };

    try {
      await axios.put(
        `${API_URL}/article?id=${article._id}`,
        updatedArticle,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }, { header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }], // Enable color and background color buttons
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"], // Remove formatting button
    ],
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
        </div>
        <p className="library-content-news-details"></p>
        <p className="library-content-news-date">
          {article.createdAt && formatDate(article.createdAt)}
        </p>
        <div className="library-content-news-description">
          {isEditing ? (
            <>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={handleChange}
                modules={modules}
              />
              <button className="library-content-save-btn" onClick={saveToDb}>
                Save
              </button>
            </>
          ) : (
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: content && content,
                }}
              />
              <button
                className="library-content-save-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library1;