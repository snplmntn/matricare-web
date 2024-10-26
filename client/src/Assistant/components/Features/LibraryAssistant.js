import React, { useState, useEffect } from "react";
import "../../style/features/libraryassistant.css";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { getCookie } from "../../../utils/getCookie";
import Article from "../../../User/components/Library/Article";
import ArticleEdit from "../Library/ArticleEdit";

const LibraryAssistant = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    author: "",
    category: "Choose A Category",
    cover: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [bookCover, setBookCover] = useState("");
  const [article, setArticles] = useState();
  const [articleNum, setArticleNum] = useState();
  const [showArticle, setShowArticle] = useState(0);

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

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get(`${API_URL}/article`, {
          headers: {
            Authorization: token,
          },
        });
        setArticles(response.data.article);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBooks();
  }, []);

  const handleImageAdd = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  async function uploadBookCover() {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("picture", selectedImage);

      try {
        const response = await axios.post(
          `${API_URL}/upload/a?userId=${userID}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setBookCover(response.data.pictureLink);
      } catch (err) {
        console.error(err);
      }
    }
  }

  const handleAddArticle = async (e) => {
    e.preventDefault();

    // Validate the article
    if (!newArticle.title || !newArticle.author || !newArticle.cover) {
      return alert("Please fill in all fields and upload a Book Cover.");
    }

    if (newArticle.category === null)
      return alert("Please fill in all fields and upload a Book Cover.");

    await uploadBookCover();

    setTimeout(async () => {
      if (!bookCover) {
        return alert("Error Uploading Image, Please Try Again.");
      }

      const newBook = {
        userId: userID,
        fullTitle: newArticle.title,
        title: newArticle.title,
        author: newArticle.author,
        category: newArticle.category,
        picture: bookCover,
        status: "Draft",
      };

      try {
        const response = await axios.post(`${API_URL}/article`, newBook, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json ",
          },
        });

        setArticles((prevBooks) => {
          const updatedBooks = [...prevBooks, response.data.newArticle];
          return updatedBooks;
        });
      } catch (err) {
        console.error(err);
      }

      setNewArticle({
        title: "",
        author: "",
        category: "Choose A Category",
        cover: null,
      });
      setShowForm(false);
    }, 2000);
  };

  return (
    <>
      {showArticle === 0 ? (
        <div className="LA-library-layout">
          <div className="LA-main-content">
            <header className="LA-library-header">
              <div className="LA-library-title">MatriCare.</div>
              <div className="LA-header-actions">
                <button
                  className="LA-add-article-button"
                  onClick={() => setShowForm(!showForm)}
                >
                  + Add Articles
                </button>
                <div className="LA-search-container">
                  <input
                    type="text"
                    className="search-bar-library"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <IoSearch className="LA-search-icon" />
                </div>
                <select
                  className="LA-filter-dropdown"
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

            {showForm && (
              <div className="modal-overlay">
                <div className="newarticle-modal">
                  <button
                    className="newarticle-close-button"
                    onClick={() => setShowForm(false)}
                  >
                    ×
                  </button>
                  <h3>New Article</h3>
                  <hr className="add-hr" />
                  <div className="LA-article-form">
                    <form
                      onSubmit={handleAddArticle}
                      className="LA-add-article-form"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageAdd(e);
                          setNewArticle({
                            ...newArticle,
                            cover: e.target.files[0],
                          });
                        }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={newArticle.title}
                        onChange={(e) =>
                          setNewArticle({
                            ...newArticle,
                            title: e.target.value,
                          })
                        }
                        required
                      />
                      <input
                        type="text"
                        placeholder="Author"
                        value={newArticle.author}
                        onChange={(e) =>
                          setNewArticle({
                            ...newArticle,
                            author: e.target.value,
                          })
                        }
                        required
                      />
                      <select
                        value={newArticle.category}
                        onChange={(e) =>
                          setNewArticle({
                            ...newArticle,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value={null}>Choose A Category</option>
                        <option value="First Time Moms">First Time Moms</option>
                        <option value="Health">Health</option>
                        <option value="Labor">Labor</option>
                        <option value="Finance">Finance</option>
                        <option value="Fashion">Fashion</option>
                      </select>
                      <button type="submit">Add Article</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <section id="library" className="LA-library-section">
              <h2>Library</h2>
              <div className="LA-book-list-container">
                {filteredBooks &&
                  filteredBooks.map((book, index) => (
                    <div
                      key={book._id}
                      className="library-item"
                      onClick={() => {
                        setArticleNum(index);
                        book.status === "Approved"
                          ? navigate(`/book/${book._id}`)
                          : setShowArticle(2);
                      }}
                    >
                      <div className="LA-book-cover-container">
                        <img
                          src={book.picture}
                          alt={book.title}
                          className="LA-book-cover"
                        />
                        {/* Show overlay for unapproved books */}
                        {(book.status === "Draft" ||
                          book.status === "Revision") && (
                          <div className="LA-overlay">
                            <span className="LA-overlay-text">
                              {book.status === "Draft"
                                ? "Waiting for Approval"
                                : "For Revisions"}
                            </span>
                          </div>
                        )}
                      </div>
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
      ) : (
        <ArticleEdit article={article[articleNum]} />
      )}
    </>
  );
};

export default LibraryAssistant;
