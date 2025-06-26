import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
  ],
};

const Library = () => {
  const navigate = useNavigate();
  const [lastRead, setLastRead] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [article, setArticles] = useState();

  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const savedLastRead = JSON.parse(localStorage.getItem("lastRead")) || [];
    setLastRead(savedLastRead);

    async function fetchBooks() {
      try {
        const response = await axios.get(`${API_URL}/article?status=Approved`, {
          headers: {
            Authorization: token,
          },
        });
        setArticles(response.data.article);
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
      } catch (error) {
        console.error(error);
      }
    }

    fetchBooks();
    fetchSavedArticle();
  }, []);

  const handleBookClick = (book) => {
    const updatedLastRead = [
      book,
      ...lastRead.filter((b) => b._id !== book._id),
    ];
    setLastRead(updatedLastRead);
    localStorage.setItem("lastRead", JSON.stringify(updatedLastRead));
    navigate(`/book/${book._id}`);
  };

  const filteredBooks = article?.filter((book) => {
    const matchesSearchTerm = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedFilter === "All" || book.category === selectedFilter;
    return matchesSearchTerm && matchesCategory;
  });

  const filterOptions = [
    "All",
    "Health & Wellness",
    "Finance & Budgeting",
    "Parenting & Family",
    "Baby’s Essentials",
    "Exercise & Fitness",
    "Labor & Delivery",
  ];

  return (
    <div className="bg-[#9a6cb4] min-h-screen">
      {/* Main Content */}
      <div className="ml-0 md:ml-[250px] p-4 md:p-5 w-full md:w-[87%] overflow-y-auto bg-white/90 rounded-t-[30px] md:rounded-[50px_0_0_50px]">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4 md:gap-0">
          <div className="text-[#7c459c] text-2xl md:text-[30px] font-extrabold ml-0 md:ml-[45px]">
            MatriCare.
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-0 md:ml-[600px] md:mr-[100px] w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                className="p-2.5 mr-0 sm:mr-[50px] border-transparent rounded-[5px] w-full sm:w-[300px] bg-white text-[#040404] pl-[35px] focus:outline-none focus:ring-2 focus:ring-[#9a6cb4]"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#040404] pointer-events-none" />
            </div>
            <select
              className="p-2 text-sm border border-[#ccc] rounded-[4px] bg-white cursor-pointer w-full sm:w-[300px] focus:outline-none focus:ring-2 focus:ring-[#9a6cb4]"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              {filterOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="p-2 bg-[#f9f9f9]"
                >
                  {option}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Last Read Section */}
        <section className="ml-0 md:ml-[50px] mb-5 text-[15px] text-[#040404]">
          <h2 className="text-[#2f2d2d] text-lg md:text-xl font-semibold mb-4">
            Books You Last Read
          </h2>
          <div className="mt-[30px]">
            <Slider {...sliderSettings}>
              {lastRead.length > 0 ? (
                lastRead.map((book) => (
                  <div
                    key={book._id}
                    className="flex-shrink-0 w-full max-w-[420px] p-2.5 mt-[60px] ml-2.5 cursor-pointer"
                    onClick={() => handleBookClick(book)}
                  >
                    <div className="h-[100px] bg-[#9a6cb4ca] flex items-center p-[15px] rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.2)]">
                      <img
                        src={book.picture}
                        alt={book.title}
                        className="w-[120px] md:w-[150px] h-[150px] md:h-[190px] object-cover mr-5 rounded-[10px]"
                      />
                      <div className="text-[#333]">
                        <h3 className="w-[120px] md:w-[150px] m-0 text-base md:text-xl text-white truncate">
                          {book.title}
                        </h3>
                        <p className="my-1 text-white text-xs md:text-sm">
                          Author: {book.author}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-24">
                  <p className="text-gray-500">No books read yet.</p>
                </div>
              )}
            </Slider>
          </div>
        </section>

        {/* Library Section */}
        <section className="ml-0 md:ml-[50px] mb-5 text-[15px] text-[#040404]">
          <h2 className="text-[#2f2d2d] text-lg md:text-xl font-semibold mb-4">
            Library
          </h2>
          <div className="mt-[30px] flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
            {filteredBooks &&
              filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="flex flex-col items-center mx-2 mb-5 p-1 rounded-[5px] w-[160px] md:min-w-[200px] cursor-pointer hover:bg-[#9a6cb450] hover:rounded-[20px] transition-all duration-200"
                  onClick={() => handleBookClick(book)}
                >
                  <img
                    src={book.picture}
                    alt={book.title}
                    className="w-[120px] md:w-[160px] h-[150px] md:h-[200px] object-cover mb-2.5 rounded-[10px]"
                  />
                  <div className="text-left w-full">
                    <h3 className="m-0 text-base md:text-xl text-[#333] text-center truncate">
                      {book.title}
                    </h3>
                    <p className="my-1 text-[#666] text-xs text-center truncate">
                      Author: {book.author}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Library;
