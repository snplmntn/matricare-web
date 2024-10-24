import React, { useState, useRef, useEffect } from "react";
import "../../styles/features/bellytalk.css";
import { getCookie } from "../../../utils/getCookie";
import { Link, useNavigate } from "react-router-dom";
import BellyTalkPost from "./BellyTalkPost";
import {
  IoSearch,
  IoBookmark,
  IoPencil,
  IoArrowBack,
  IoPersonCircle,
} from "react-icons/io5";
import { FcPicture } from "react-icons/fc";
import PostSkeleton from "./PostSkeleton";
import { useInView } from "react-intersection-observer";
import { CookiesProvider, useCookies } from "react-cookie";

import axios from "axios";

const BellyTalk = ({ user }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const { ref: myRef, inView: fetchPost } = useInView();
  const navigate = useNavigate();
  // const { name, username, role } = user.current;
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [posts, setPosts] = useState([]);
  const [allPost, setAllPost] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const [newPostText, setNewPostText] = useState("");
  // const [imgLink, setImgLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  //image -> firebase
  const [selectedImage, setSelectedImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [isPosting, setIsPosting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [changeFilter, setChangeFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [fetchAgain, setFetchAgain] = useState(false);

  const openModal = () => {
    if (!token) {
      navigate("/login");
    }
    setIsModalOpen(true);
    setNewPostText("");
    setStep(1);
    setSelectedImage(null);
    setImagePreview(null);
    setIsPosting("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewPostText("");
    setStep(1);
    setSelectedImage(null);
    setImagePreview(null);
    setIsPosting("");
  };

  const handleRemoveImage = (index) => {
    setSelectedImage((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreview((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const handleNextStep = async () => {
    console.log(selectedImage);
    if (selectedImage && selectedImage.length > 0) {
      const formData = new FormData();

      // Loop through each image in selectedImage array and append it to formData
      selectedImage.forEach((image) => {
        formData.append("picture", image);
      });

      try {
        const response = await axios.post(
          `${API_URL}/upload/b?userId=${userID}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.pictureLink;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handlePostSubmit = async () => {
    setIsPosting(true);
    if (newPostText.trim() === "") {
      setIsPosting(false);
      alert("Post content cannot be empty.");
      return;
    }

    let imgLink;

    if (selectedImage) {
      // Wait for handleNextStep to complete and get the image link
      imgLink = await handleNextStep();
      if (!imgLink) {
        setIsPosting(false);
        alert("Image upload failed. Please try again.");
        return;
      }
    }

    const newPost = {
      userId: userID,
      fullname: user.current.name,
      content: newPostText,
      address: "Manila City",
      picture: imgLink,
    };

    try {
      setIsPosting(true);
      const response = await axios.post(`${API_URL}/post/`, newPost, {
        headers: {
          Authorization: token,
        },
      });

      setPosts([response.data.savedPost, ...posts]);
      setAllPost([response.data.savedPost, ...allPost]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }

    setNewPostText("");
    // setImgLink("");
    setSelectedImage(null);
    setImagePreview(null);
    setSuccessMessage("Post Submitted");
    setSelectedCategories([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array

    setSelectedImage(files);

    // Generate previews for each selected image
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  async function fetchPosts() {
    if (loading) return;
    setLoading(true);
    console.log(
      `${allPost.length > 0 ? allPost[allPost.length - 1]._id : ""} fetching`
    );

    const lastPostId =
      allPost.length > 0 ? allPost[allPost.length - 1]._id : null;
    try {
      const response = await axios.get(
        `${API_URL}/${token ? "post" : "bellytalk"}/i${
          lastPostId ? `?postId=${lastPostId}` : ""
        }`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPosts((prevPosts) => [...prevPosts, ...response.data]);
      setAllPost((prevPosts) => [...prevPosts, ...response.data]);

      if (fetchAgain) setFetchAgain(false);
      if (response.data.length === 0) setShowLoading(false);
      else CheckToFetchMore();
      setLoading(false);

      console.log(`done fetching`);
    } catch (error) {
      console.error(error);
    }
  }

  const [activeFilters, setActiveFilters] = useState([]);

  const handleFilterChange = (filterType) => {
    setActiveFilters((prevFilters) => {
      if (prevFilters.includes(filterType)) {
        return prevFilters.filter((filter) => filter !== filterType);
      } else {
        return [...prevFilters, filterType];
      }
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (!allPost) return;

    const filteredPosts = allPost.filter((post) => {
      const matchesSearchTerm =
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post &&
          post.comments &&
          post.comments.some((comment) =>
            comment.content.toLowerCase().includes(searchTerm.toLowerCase())
          ));
      const matchesCategory =
        activeFilters.length === 0 ||
        activeFilters.includes("All") ||
        (post.category &&
          activeFilters.some((filter) => post.category.includes(filter)));
      return matchesSearchTerm && matchesCategory;
    });
    setPosts(filteredPosts);
  }, [searchTerm, activeFilters, allPost]);

  const handleSavedButtonClick = () => {
    navigate("/saved-posts");
  };

  const onDeletePost = async (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
    setAllPost(allPost.filter((post) => post._id !== postId));
  };

  const CheckToFetchMore = () => {
    if (fetchPost)
      setTimeout(() => {
        if (!fetchAgain) setFetchAgain(true);
      }, 3000);
  };
  useEffect(() => {
    if (fetchPost && !loading) fetchPosts();
  }, [fetchPost, fetchAgain]);

  const handleOpenUserProfile = () => {
    navigate("/userprofile");
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/logout`, {
        headers: {
          Authorization: token,
        },
      });

      removeCookie("userID");
      removeCookie("verifyToken");
      removeCookie("role");
      localStorage.removeItem("userData");
      localStorage.removeItem("address");
      localStorage.removeItem("email");
      localStorage.removeItem("events");
      localStorage.removeItem("userData");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("profileImageUrl");
      localStorage.removeItem("savedArticles");
      localStorage.removeItem("userName");
      removeCookie("token");
    } catch (err) {
      console.error(
        "Something went wrong!",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <div className="bellytalk-container">
      <div className="bellytalk-top-bar">
        {user.current && user.current.role !== "Ob-gyne Specialist" && (
          <button onClick={handleBackButton} className="BT-back-button">
            <IoArrowBack size={30} />
          </button>
        )}
        <div className="bellytalk-title-logo">BellyTalk</div>
        <div className="bellytalk-icons">
          <button
            className="bellytalk-icon-button"
            onClick={handleSavedButtonClick}
          >
            <IoBookmark className="bellytalk-icon" />
            <span className="bellytalk-label">Saved</span>
          </button>
        </div>

        <div className="bellytalk-search-container">
          <IoSearch className="bellytalk-search-icon" />
          <input
            type="text"
            className="bellytalk-search"
            placeholder="Search for people, insights and more..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="bt-dropdown-container">
          <div onClick={toggleDropdown} className="BT-profile-button">
            {user.current && user.current.role === "Ob-gyne Specialist" && (
              <IoPersonCircle />
            )}
          </div>

          {isOpen && (
            <div className="bt-dropdown-menu">
              <ul>
                <li onClick={handleOpenUserProfile}>
                  <a href="/userprofile">User Profile</a>
                </li>
                <li>
                  <span onClick={handleLogout}>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <main className="bellytalk-main-content">
        <div className="sharebox">
          <div className="sharebox-container" onClick={openModal}>
            <IoPencil className="pen-icon" />
            <input
              type="text"
              placeholder="What's your experience?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="bellytalk-share-box-input"
            />
          </div>
        </div>

        <div className="content-container">
          {isModalOpen && (
            <div className="sharebox-modal-overlay">
              <div className="sharebox-modal-content">
                <span onClick={closeModal} className="sharebox-back-button">
                  <IoArrowBack />
                </span>

                {step === 1 && (
                  <>
                    <h2 className="sharebox-title">Create a New Talk</h2>
                    <textarea
                      placeholder="What's your experience?"
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      className="sharebox-textarea"
                    />
                    <div className="upload-button">
                      <p>Add to your post</p>
                      <label
                        htmlFor="file-upload"
                        className="custom-file-upload"
                      >
                        <FcPicture />
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        multiple
                        style={{ display: "none" }} // Hide the default file input
                      />
                    </div>
                    {imagePreview && imagePreview.length > 0 && (
                      <div className="image-preview-container">
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="image-preview">
                            <img
                              src={preview}
                              alt={`Selected ${index}`}
                              className="preview-image"
                            />
                            <span
                              className="remove-image"
                              onClick={() => handleRemoveImage(index)}
                            >
                              ×
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={handlePostSubmit}
                      className="sharebox-button"
                    >
                      {isPosting ? "Posting..." : "Post"}
                    </button>
                    {successMessage && (
                      <p className="success-message">{successMessage}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <section className="bellytalk-feed">
          {posts.length > 0 &&
            posts.map((post) => (
              <>
                <BellyTalkPost
                  key={post._id}
                  post={post}
                  user={user}
                  onDeletePost={onDeletePost}
                />
              </>
            ))}

          {showLoading && (
            <div ref={myRef}>
              <PostSkeleton cards={2} />
            </div>
          )}
        </section>
        <div className="filter-section">
          <h3>Filters</h3>
          <div className="filter-container">
            <input
              type="checkbox"
              id="all"
              onChange={() => handleFilterChange("All")}
            />
            <label htmlFor="all">All</label>

            <input
              type="checkbox"
              id="first-time"
              onChange={() => handleFilterChange("Health & Wellness")}
            />
            <label htmlFor="first-time">Health & Wellness</label>

            <input
              type="checkbox"
              id="baby-essentials"
              onChange={() => handleFilterChange("Finance & Budgeting")}
            />
            <label htmlFor="baby-essentials">Finance & Budgeting</label>

            <input
              type="checkbox"
              id="maternity-style"
              onChange={() => handleFilterChange("Parenting & Family")}
            />
            <label htmlFor="maternity-style">Parenting & Family</label>

            <input
              type="checkbox"
              id="breast-feeding"
              onChange={() => handleFilterChange("Baby’s Essentials")}
            />
            <label htmlFor="breast-feeding">Baby’s Essentials</label>

            <input
              type="checkbox"
              id="gender-reveal"
              onChange={() => handleFilterChange("Exercise & Fitness")}
            />
            <label htmlFor="gender-reveal">Exercise & Fitness</label>

            <input
              type="checkbox"
              id="parenting-tips"
              onChange={() => handleFilterChange("Labor & Delivery")}
            />
            <label htmlFor="parenting-tips">Labor & Delivery</label>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BellyTalk;
