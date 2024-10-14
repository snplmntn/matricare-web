import React, { useState, useRef, useEffect } from "react";
import "../../styles/features/bellytalk.css";
import { getCookie } from "../../../utils/getCookie";
import { useNavigate } from "react-router-dom";
import BellyTalkPost from "./BellyTalkPost";
import {
  IoSearch,
  IoBookmark,
  IoPencil,
  IoArrowBack,
  IoCloudUploadOutline,
} from "react-icons/io5";

import axios from "axios";

const BellyTalk = ({ user }) => {
  const navigate = useNavigate();
  // const { name, username, role } = user.current;
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [posts, setPosts] = useState();
  const [allPost, setAllPost] = useState();
  const API_URL = process.env.REACT_APP_API_URL;
  const [newPostText, setNewPostText] = useState("");
  const [imgLink, setImgLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  //image -> firebase
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isPosting, setIsPosting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [changeFilter, setChangeFilter] = useState("");

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

  const handleNextStep = async () => {
    setImgLink("");
    if (selectedImage) {
      const formData = new FormData();
      formData.append("picture", selectedImage);
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
        setImgLink(response.data.pictureLink);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePostSubmit = async () => {
    setIsPosting(true);
    if (newPostText.trim() === "") {
      setIsPosting(false);
      alert("Post content cannot be empty.");
      return;
    }

    if (selectedImage) {
      await handleNextStep();
      setTimeout(() => {
        if (!imgLink) {
          setIsPosting(false);
          alert("Image upload failed. Please try again.");
          return;
        }
      }, 1000);
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
    } catch (error) {
      console.error(error);
    }
    setNewPostText("");
    setSelectedImage(null);
    setImagePreview(null);
    setSuccessMessage("Post Submitted");
    setIsPosting("Next");
    setIsModalOpen(false);
    setSelectedCategories([]);
  };

  const handleFileChange = (e) => {
    //state that will be passed in backend

    const file = e.target.files[0];
    setSelectedImage(file);

    //display image preview
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(
          `${API_URL}/${token ? "post" : "bellytalk"}/i`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setPosts(response.data);
        setAllPost(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPosts();
  }, [isFetching]);

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

  const handleSavedButtonClick = () => {
    navigate("/saved-posts");
  };

  useEffect(() => {
    if (activeFilters.length === 0 || activeFilters.includes("All")) {
      setPosts(allPost);
    } else {
      const filteredPosts = allPost.filter((post) =>
        activeFilters.some((filter) => post.category.includes(filter))
      );
      setPosts(filteredPosts);
    }
  }, [activeFilters, allPost]);

  const onDeletePost = async (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
    setAllPost(allPost.filter((post) => post._id !== postId));
  };

  return (
    <div className="bellytalk-container">
      <div className="bellytalk-top-bar">
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
          />
        </div>
      </div>

      <main className="bellytalk-main-content">
        <section className="trending-section">
          <h2>Trending Now</h2>
          <div className="trending-articles">
            <article className="trending-article">
              <div className="article-image">
                <img src="img/topic1.jpg" alt="Article Headline 1" />
                <div className="headlines">
                  <h3>Maternal Health Disparities</h3>
                  <p>Posted by: Bea Benella Rosal</p>
                </div>
              </div>
            </article>
            <article className="trending-article">
              <div className="article-image">
                <img src="img/topic2.jpg" alt="Article Headline 2" />
                <div className="headlines">
                  <h3>Home Births and Midwifery</h3>
                  <p>Posted by: Bea Benella Rosal</p>
                </div>
              </div>
            </article>
            <article className="trending-article">
              <div className="article-image">
                <img src="img/topic3.jpg" alt="Article Headline 3" />
                <div className="headlines">
                  <h3>Celebrity Pregnancy Announcements</h3>
                  <p>Posted by: Bea Benella Rosal</p>
                </div>
              </div>
            </article>
            <article className="trending-article">
              <div className="article-image">
                <img src="img/topic4.jpg" alt="Article Headline 4" />
                <div className="headlines">
                  <h3>
                    Rihanna Reveals Due Date for Her Second Baby During a
                    Concert
                  </h3>
                  <p>Posted by: Bea Benella Rosal</p>
                </div>
              </div>
            </article>
          </div>
        </section>

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
                      <label
                        htmlFor="file-upload"
                        className="custom-file-upload"
                      >
                        <IoCloudUploadOutline />
                        Upload Photo
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: "none" }} // Hide the default file input
                      />
                    </div>
                    {imagePreview && (
                      <div className="image-preview">
                        <img
                          src={imagePreview}
                          alt="Selected"
                          className="preview-image"
                        />
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
          {posts ? (
            posts.map((post) => (
              <BellyTalkPost
                key={post._id}
                post={post}
                user={user}
                onDeletePost={onDeletePost}
              />
            ))
          ) : (
            <p>NO POSTS</p>
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
              onChange={() => handleFilterChange("First-Time Moms")}
            />
            <label htmlFor="first-time">First-Time Moms</label>

            <input
              type="checkbox"
              id="baby-essentials"
              onChange={() => handleFilterChange("Baby Essentials")}
            />
            <label htmlFor="baby-essentials">Baby Essentials</label>

            <input
              type="checkbox"
              id="maternity-style"
              onChange={() => handleFilterChange("Maternity Style")}
            />
            <label htmlFor="maternity-style">Maternity Style</label>

            <input
              type="checkbox"
              id="breast-feeding"
              onChange={() => handleFilterChange("Breast Feeding")}
            />
            <label htmlFor="breast-feeding">Breast Feeding</label>

            <input
              type="checkbox"
              id="gender-reveal"
              onChange={() => handleFilterChange("Gender Reveal")}
            />
            <label htmlFor="gender-reveal">Gender Reveal</label>

            <input
              type="checkbox"
              id="parenting-tips"
              onChange={() => handleFilterChange("Parenting Tips")}
            />
            <label htmlFor="parenting-tips">Parenting Tips</label>

            <input
              type="checkbox"
              id="labor"
              onChange={() => handleFilterChange("Labor")}
            />
            <label htmlFor="labor">Labor</label>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BellyTalk;
