import React, { useState, useEffect } from "react";
import "../../styles/features/libraryconsultant.css";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";
import Article from "../../../User/components/Library/Article";

const initialBooks = [
  {
    id: 1,
    title: "Stages of Pregnancy",
    author: "Bea Benella Rosal",
    cover: "/img/topic1.jpg",
    category: "First Time Moms",
    approved: false,
    forRevisions: false,
  },
  {
    id: 2,
    title: "Maternity Style",
    author: "Bea Benella Rosal",
    cover: "/img/topic2.jpg",
    category: "Fashion",
    approved: true,
    forRevisions: false,
  },
  {
    id: 3,
    title: "Pregnancy Fitness",
    author: "Bea Benella Rosal",
    cover: "/img/topic3.jpg",
    category: "Health",
    approved: true,
    forRevisions: false,
  },
  {
    id: 4,
    title: "Preparing for Baby",
    author: "Bea Benella Rosal",
    cover: "/img/topic4.jpg",
    category: "First Time Moms",
    approved: true,
    forRevisions: false,
  },
  {
    id: 5,
    title: "Pregnancy Safety",
    author: "Bea Benella Rosal",
    cover: "/img/topic5.jpg",
    category: "Health",
    approved: true,
    forRevisions: false,
  },
  {
    id: 6,
    title: "Pregnancy Symptoms",
    author: "Bea Benella Rosal",
    cover: "/img/labor1.jpg",
    category: "Health",
    approved: true,
    forRevisions: false,
  },
  {
    id: 7,
    title: "Labor and Delivery Options",
    author: "Bea Benella Rosal",
    cover: "/img/bg6.jpg",
    category: "Labor",
    approved: true,
    forRevisions: false,
  },
  {
    id: 8,
    title: "Baby’s First Days at Home",
    author: "Bea Benella Rosal",
    cover: "/img/pic1.jpg",
    category: "First Time Moms",
    approved: true,
    forRevisions: false,
  },
  {
    id: 9,
    title: "Financial Planning for New Parents",
    author: "Bea Benella Rosal",
    cover: "/img/bg5.jpg",
    category: "Finance",
    approved: true,
    forRevisions: false,
  },
  {
    id: 10,
    title: "Preparing for Breastfeeding",
    author: "Bea Benella Rosal",
    cover: "/img/article1.webp",
    category: "Health",
    approved: true,
    forRevisions: false,
  },
  {
    id: 11,
    title: "Labor Preparation Techniques",
    author: "Bea Benella Rosal",
    cover: "/img/bg2.webp",
    category: "Labor",
    approved: true,
    forRevisions: false,
  },
  {
    id: 12,
    title: "Baby’s First Days at Home",
    author: "Bea Benella Rosal",
    cover: "/img/bg1.webp",
    category: "First Time Moms",
    approved: true,
    forRevisions: false,
  },
  {
    id: 13,
    title: "Weekly Pregnancy",
    author: "Bea Benella Rosal",
    cover: "/img/bg1.webp",
    category: "First Time Moms",
    approved: true,
    forRevisions: false,
  },
];

// Map book IDs to their routes
const bookRoutes = {
  1: "/library-item1",
  2: "/library-item2",
  3: "/library-item3",
  4: "/library-item4",
  5: "/library-item5",
  6: "/library-item6",
  7: "/library-item7",
  8: "/library-item8",
  9: "/library-item9",
  10: "/library-item10",
  11: "/library-item11",
  12: "/library-item12",
  13: "/library-item13",
};

const LibraryConsultant = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState();
  const token = getCookie("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [books, setBooks] = useState(initialBooks);
  const [hoveredBookId, setHoveredBookId] = useState(null);

  const filteredBooks = books.filter((book) => {
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

  // Handle Approve
  const handleApproveArticle = async (id) => {
    try {
      await axios.put(
        `${API_URL}/article?id=${id}`,
        {
          reviewedBy: user.name,
          status: "Approved",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(`Approved article with ID: ${id}`);
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === id ? { ...book, status: "Approved" } : book
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Reject
  const handleRejectArticle = async (id) => {
    try {
      await axios.put(
        `${API_URL}/article?id=${id}`,
        {
          status: "Revision",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === id ? { ...book, status: "Revision" } : book
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) setUser(JSON.parse(userData));

    async function fetchBooks() {
      try {
        const response = await axios.get(`${API_URL}/article`, {
          headers: {
            Authorization: token,
          },
        });
        setBooks(response.data.article);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div className="LC-library-layout">
      <div className="LC-main-content">
        <header className="LC-library-header">
          <div className="LC-library-title">MatriCare.</div>
          <div className="LC-header-actions">
            <div className="LC-search-container">
              <input
                type="text"
                className="search-bar-library"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch className="LC-search-icon" />
            </div>
            <select
              className="LC-filter-dropdown"
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

        <section id="library" className="LC-library-section">
          <h2>Library</h2>
          <div className="LC-book-list-container">
            {filteredBooks.map((book, index) => (
              <div
                key={book._id}
                className="LC-library-item"
                onMouseEnter={() => setHoveredBookId(book._id)} // Track hovered book
                onMouseLeave={() => setHoveredBookId(null)} // Clear on leave
                onClick={() => {
                  navigate(`/book/${book._id}`);
                }}
              >
                <Link
                  to={bookRoutes[book._id]}
                  className="LC-library-item-link"
                >
                  <div className="LC-book-cover-container">
                    <img
                      src={book.picture}
                      alt={book.title}
                      className="LC-book-cover"
                    />
                    {book.status === "Draft" ? (
                      <div
                        className={`LC-overlay ${
                          !book.approved ? "LC-visible-overlay" : ""
                        }`}
                      >
                        {hoveredBookId !== book._id ? (
                          <span className="LC-overlay-text">
                            {book.status === "Revision"
                              ? "For Revisions"
                              : "Waiting for Approval"}
                          </span>
                        ) : (
                          <div className="LC-approval-buttons">
                            <button
                              className="LC-approve-btn"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent Link navigation
                                e.preventDefault();
                                handleApproveArticle(book._id);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className="LC-reject-btn"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent Link navigation
                                e.preventDefault();
                                handleRejectArticle(book._id);
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      book.status === "Revision" && (
                        <div
                          className={`LC-overlay ${
                            !book.approved ? "LC-visible-overlay" : ""
                          }`}
                        >
                          <span className="LC-overlay-text">For Revision</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="LC-book-details">
                    <h3 className="LC-book-title">{book.title}</h3>
                    <p className="LC-book-author">Author: {book.author}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LibraryConsultant;
