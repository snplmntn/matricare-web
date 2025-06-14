import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        const response = await axios.get(`${API_URL}/user?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
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
    <div className="bg-[#9a6cb4] min-h-screen">
      {/* Mobile padding top to account for mobile nav */}
      <div className="ml-0 md:ml-[250px] p-4 md:p-5 w-full md:w-[87%] overflow-y-auto bg-white/90 rounded-t-[30px] md:rounded-[50px_0_0_50px] min-h-screen pt-16 md:pt-5">
        <section className="mt-5 ml-0 md:ml-5">
          <h2 className="text-2xl md:text-[28px] font-semibold text-[#333] mb-5">
            Saved Articles
          </h2>

          <div className="flex flex-wrap gap-5">
            {savedArticles.length === 0 ? (
              <p className="text-gray-600 text-center w-full py-8">
                No saved articles yet.
              </p>
            ) : (
              savedArticles.map((article, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] bg-[#f9f9f9] rounded-lg overflow-hidden transition-shadow duration-200 ease-in-out cursor-pointer hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)]"
                  onClick={() => handleArticleClick(article)}
                >
                  <img
                    src={article.picture}
                    alt={article.title}
                    className="w-full h-[200px] object-cover border-b border-[#ddd]"
                  />

                  <div className="p-[15px] flex flex-col gap-2.5">
                    <h3 className="text-lg font-semibold text-[#333] truncate">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[#777]">
                      Published on: {formatDate(article.createdAt)}
                    </p>
                    <p className="text-sm text-[#777] truncate">
                      Reviewed by: {article.reviewedBy}
                    </p>
                  </div>

                  <button
                    className="bg-[#e39fa9] text-white py-2 px-3 border-none rounded text-sm cursor-pointer mx-[15px] mb-2.5 transition-colors duration-300 ease-in-out text-center self-center w-4/5 hover:bg-[#9a6cb4]"
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
