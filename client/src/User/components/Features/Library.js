import React, { useState, useEffect } from "react";
import "../../styles/features/library.css";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";
import Article from "../Library/Article";

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
  const [selectedFilter, setSelectedFilter] = useState("All"); // State for selected filter
  const [article, setArticles] = useState();
  const [articleNum, setArticleNum] = useState();
  const [showArticle, setShowArticle] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [savedArticles, setSavedArticles] = useState([]);

  // Load the last read books from local storage on component mount
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

    fetchBooks();
    fetchSavedArticle();
  }, []);

  // const handleBookClick = (book) => {
  //   const updatedLastRead = [
  //     book,
  //     ...lastRead.filter((b) => b._id !== book._id),
  //   ];
  //   setLastRead(updatedLastRead);

  //   // Save the updated last read list to local storage
  //   localStorage.setItem("lastRead", JSON.stringify(updatedLastRead));
  // };

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

  const filteredBooks = article?.filter((book) => {
    const matchesSearchTerm = book.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedFilter === "All" || book.category === selectedFilter; // Filter by category
    return matchesSearchTerm && matchesCategory;
  });

  // Define filter options
  const filterOptions = [
    "All",
    "First Time Moms",
    "Health",
    "Labor",
    "Finance",
    "Fashion",
  ];

  return (
    <div className="library-layout">
      <div className="main-content">
        <header className="library-header">
          <div className="library-title">MatriCare.</div>
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                className="search-bar-library"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch className="search-icon" />
            </div>
            <select
              className="filter-dropdown"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)} // Update filter on selection
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section id="last-read" className="last-read-section">
          <h2>Books You Last Read</h2>
          <Slider {...sliderSettings}>
            {lastRead.length > 0 ? (
              lastRead.map((book, index) => (
                <div
                  key={book._id}
                  className="last-read-item"
                  onClick={() => {
                    console.log(book._id); // Log the book id
                    setArticleNum(index);
                    handleBookClick(book);
                    setShowArticle(true);
                  }}
                >
                  <div className="book-background">
                    <img
                      src={book.picture}
                      alt={book.title}
                      className="book-cover"
                    />
                    <div className="book-details">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">Author: {book.author}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No books read yet.</p>
            )}
          </Slider>
        </section>

        <section id="library" className="library-section">
          <h2>Library</h2>
          <div className="book-list-container">
            {filteredBooks &&
              filteredBooks.map((book, index) => (
                <div
                  key={book._id}
                  className="library-item"
                  onClick={() => {
                    console.log(book._id); // Log the book id
                    setArticleNum(index);
                    handleBookClick(book);
                    setShowArticle(true);
                  }}
                >
                  <img
                    src={book.picture}
                    alt={book.title}
                    className="book-cover"
                  />
                  <div className="book-details">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">Author: {book.author}</p>
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
