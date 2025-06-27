import React, { useState, useEffect } from "react";
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const savedLastRead = JSON.parse(localStorage.getItem("lastRead")) || [];
    setLastRead(savedLastRead);

    async function fetchArticle() {
      try {
        const response = await axios.get(`${API_URL}/article?id=${bookId}`, {
          headers: {
            Authorization: token,
          },
        });
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
        const response = await axios.get(`${API_URL}/user?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
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

    localStorage.setItem("lastRead", JSON.stringify(updatedLastRead));
    navigate(`/book/${book._id}`);
  };

  return (
    <div className="flex min-h-screen bg-[#9a6cb4] flex-col lg:flex-row">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 md:top-[30px] md:left-[270px] bg-none border-none text-2xl cursor-pointer flex items-center z-[1000] text-white md:text-black"
      >
        <IoArrowBack className="mr-1" />
      </button>

      {/* Main Content */}
      <div className="flex flex-col bg-white/90 ml-0 md:ml-[250px] rounded-t-[30px] md:rounded-[50px_0_0_50px] w-full lg:w-[60%] min-h-screen pt-16 md:pt-0">
        {/* Title and Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mx-4 md:mx-[70px] mb-[30px] mt-5 md:mt-[20px] gap-4 lg:gap-0">
          <h1 className="text-xl md:text-2xl font-bold w-full lg:w-[600px] my-1 pr-4 lg:pr-0">
            {article && article.fullTitle}
          </h1>
          <div className="flex flex-col items-start lg:items-end gap-2.5 w-full lg:w-auto lg:mt-5 lg:mr-[70px]">
            <button
              className="bg-transparent border border-[#7c459c] p-[15px] rounded-[50px] cursor-pointer flex items-center gap-2 text-sm hover:bg-[#7c459c] hover:text-white transition-colors duration-200"
              onClick={() => handleToggleSave({ article })}
            >
              <IoBookmark className="text-base" />
              {isSavedComponent ? "Saved" : "Save to Library"}
            </button>
          </div>
        </div>

        {/* Article Details */}
        <p className="text-[#333] text-base mx-4 md:mx-[70px] -mt-[30px]">
          Medically Reviewed by: {article && article.reviewedBy}
        </p>
        <p className="text-[#888] text-sm mx-4 md:mx-[70px]">
          {article && `Updated: ${formatDate(article.updatedAt)}`}
        </p>

        {/* Article Content */}
        <div className="mt-5 max-h-[900px] overflow-y-auto mx-4 md:mx-[70px] w-auto md:w-[900px] scrollbar-hide">
          {article && (
            <div
              className="
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-5 [&_h2]:mt-5 [&_h2]:mb-2.5 [&_h2]:text-[#7c459c]
                [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-2.5
                [&_ul]:list-disc [&_ul]:ml-5
                [&_li]:mb-2
              "
              dangerouslySetInnerHTML={{
                __html: article.content && JSON.parse(article.content),
              }}
            />
          )}
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="flex-1 bg-white/90 px-4 md:px-6 py-6 lg:py-0">
        <div className="flex justify-between items-center mb-5 mt-0 lg:mt-10">
          <h2 className="text-xl md:text-2xl font-bold text-[#7c459c]">
            Related Articles
          </h2>
        </div>

        <div className="space-y-5">
          {relatedArticles.map((relatedArticle) => (
            <div
              key={relatedArticle._id}
              className="block bg-white rounded-lg overflow-hidden w-full lg:w-[450px] h-[250px] cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleBookClick(relatedArticle)}
            >
              <img
                src={relatedArticle.picture}
                alt="Related news"
                className="w-full h-[150px] object-cover"
              />
              <div className="p-2.5">
                <div className="inline-block bg-[#e39fa981] text-[#7c459c] py-1 px-2.5 rounded-[20px] text-xs -mb-2.5 ml-1 mt-2.5">
                  {relatedArticle.category}
                </div>
                <h3 className="text-base font-bold mb-1 ml-1 truncate">
                  {relatedArticle.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Article;
