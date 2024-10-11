import React, { useState, useEffect } from "react";
import "../../styles/library/library1.css";
import { IoBookmark, IoShareSocial } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styles
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

const Library1 = () => {
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [savedArticles, setSavedArticles] = useState([]);
  const [content, setContent] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (value) => {
    setContent(value); // Value contains the HTML or delta format of Quill's content
  };

  const saveToDb = async () => {
    const newArticle = {
      userId: "66f6fbf00e6758da904b5650",
      author: "Bea Benella Rosal",
      title: "Maternity Style",
      fullTitle:
        "Embracing Maternity Style: Fashion Tips for Every Stage of Pregnancy",
      category: "Fashion",
      status: "Approved",
      picture:
        "https://firebasestorage.googleapis.com/v0/b/matricare-63671.appspot.com/o/article%2F66f6fbf00e6758da904b5650%2Ftopic2.jpg-1728459369410-422179167?alt=media&token=8b543a54-eabe-48ac-bb47-a4504d0e13c8",
      content: JSON.stringify(content),
    };

    try {
      const response = await axios.post(`${API_URL}/article`, newArticle, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2ZmEzZmVlMmEzMzcyZTFkZDUyNjE1ZSIsImZ1bGxOYW1lIjoiU2VhbiBQYXVsIE1vbnRvbiIsImVtYWlsIjoiZGV2LnNucGxtbnRuQGdtYWlsLmNvbSIsImVtYWlsVmFsaWQiOnRydWUsInVzZXJuYW1lIjoienp6MiIsInBhc3N3b3JkIjoiJDJiJDEwJC45eXlLYmFnNldNSExRbXVIa3NJVE9Dbk1hQmpnbVU2Q25uQVlQLzc0cjdld01qS1BnQmJPIiwicGhvbmVOdW1iZXIiOiIwOTY4MzAzNzc4MCIsInJvbGUiOiJPYmd5bmUiLCJhcnRpY2xlTGFzdFJlYWQiOltdLCJzYXZlZFBvc3QiOltdLCJsaWtlZFBvc3QiOltdLCJjcmVhdGVkQXQiOiIyMDI0LTA5LTMwVDA2OjA2OjM4LjI0OFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTA4VDE1OjMxOjQwLjIyOVoiLCJfX3YiOjEsInRva2VuIjoiOUVDOEVDIiwiYWRkcmVzcyI6IiIsImFzc2lnbmVkVGFzayI6W10sImh1c2JhbmROdW1iZXIiOiIwOTE5NDI1NDg5MCIsImh1c2JhbmQiOiJNYXJjIENhc3RpbGxvIn0sImlhdCI6MTcyODQ1NjU2MCwiZXhwIjoxNzMxMDQ4NTYwfQ.lTAUyG9TL__CDx5hVtGglklzxDNsasqIhYMXPbeNTRA",
        },
      });

      console.log(response);
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
            <button className="library-content-share-btn">
              <IoShareSocial /> Share on media
            </button>
          </div>
        </div>
        <p className="library-content-news-details">
          Medically Reviewed by: Dra. Donna Jill A. Tungol
        </p>
        <p className="library-content-news-date">11/30/2019</p>
        <div className="library-content-news-description">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={handleChange}
            modules={modules}
          />
          <button className="library-content-read-more-btn" onClick={saveToDb}>
            Save
          </button>
          <div dangerouslySetInnerHTML={{ __html: content }} />
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
