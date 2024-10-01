import React, { useState, useRef, useEffect } from "react";
import "../../styles/features/bellytalk.css";
import { getCookie } from "../../../utils/getCookie";
import { useNavigate } from "react-router-dom";
import BellyTalkPost from "./BellyTalkPost";
import {
  IoSearch,
  IoBookmark,
  IoHeart,
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
  // {
  //   id: 1,
  //   user: "Karyll Cruz",
  //   location: "San Jose, Bulacan",
  //   content:
  //     "👶 From the first flutter of kicks to the first giggles, being a mom means experiencing a love so deep it's beyond words. Cherishing these tiny milestones that fill my heart with endless joy.",
  //   comments: [],
  //   image: null,
  // },
  // {
  //   id: 2,
  //   user: "Theresa Neilson",
  //   location: "Sampaloc, Manila",
  //   content:
  //     "Embracing the chaos and cuddles, because thats what makes motherhood magical. From messy mornings to bedtime stories, every moment with my little ones is a precious memory in the making. 💕",
  //   comments: [],
  //   image: null,
  // },
  const [newPostText, setNewPostText] = useState("");
  const [imgLink, setImgLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(2);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  //image -> firebase
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isPosting, setIsPosting] = useState(false);

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
    setIsPosting(true);
    setImgLink("");
    if (selectedImage) {
      const formData = new FormData();
      formData.append("picture", selectedImage);
      try {
        console.log(formData);
        const response = await axios.post(
          `https://matricare-web.onrender.com/api/upload/p?userId=${userID}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
        setImgLink(response.data.pictureLink);
      } catch (error) {
        console.error(error);
      }
    }
    setIsPosting(false);
    setStep(2);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handlePostSubmit = async () => {
    setIsPosting(true);
    if (newPostText.trim() === "") {
      alert("Post content cannot be empty.");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    const newPost = {
      userId: userID,
      fullname: user.current.name,
      content: newPostText,
      address: "Manila City",
      category: selectedCategories,
      picture: imgLink,
    };

    try {
      setIsPosting("Posting...");
      const response = await axios.post(
        `https://matricare-web.onrender.com/api/post/`,
        newPost,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setPosts([
        {
          userId: userID,
          fullname: user.current.name,
          content: newPostText,
          address: "Manila City",
          category: selectedCategories,
          picture: imagePreview,
        },
        ...posts,
      ]);
      console.log(posts);
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

  const filterPosts = (filterType) => {
    // Logic to filter posts based on the filterType
    console.log(`Filtering posts by: ${filterType}`);
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(
          "https://matricare-web.onrender.com/api/post/i",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="bellytalk-container">
      <div className="bellytalk-top-bar">
        <div className="bellytalk-title-logo">BellyTalk</div>
        <div className="bellytalk-icons">
          <button className="bellytalk-icon-button">
            <IoBookmark className="bellytalk-icon" />
            <span className="bellytalk-label">Saved</span>
          </button>
          <button className="bellytalk-icon-button">
            <IoHeart className="bellytalk-icon" />
            <span className="bellytalk-label">Favorites</span>
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
                      onClick={handleNextStep}
                      className="sharebox-button"
                    >
                      {isPosting ? "..." : "Next"}
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="sharebox-title">Select Categories</h2>
                    <div className="category-options">
                      {[
                        "First-Time Moms",
                        "Breast Feeding",
                        "Maternity Style",
                        "Labor",
                        "Baby Essentials",
                      ].map((category) => (
                        <div
                          key={category}
                          className={`category-option ${
                            selectedCategories.includes(category)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleCategoryClick(category)} // Handle click to select/deselect
                        >
                          {category}
                        </div>
                      ))}
                    </div>
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
            posts.map((post) => <BellyTalkPost key={post._id} post={post} />)
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
              onChange={() => filterPosts("All")}
            />
            <label for="all">All</label>

            <input
              type="checkbox"
              id="first-time"
              onChange={() => filterPosts("first-time")}
            />
            <label for="first-time">First-Time Moms</label>

            <input
              type="checkbox"
              id="baby-essentials"
              onChange={() => filterPosts("baby-essentials")}
            />
            <label for="baby-essentials">Baby Essentials</label>

            <input
              type="checkbox"
              id="maternity-style"
              onChange={() => filterPosts("maternity-style")}
            />
            <label for="maternity-style">Maternity Style</label>

            <input
              type="checkbox"
              id="breast-feeding"
              onChange={() => filterPosts("breast-feeding")}
            />
            <label for="breast-feeding">Breast Feeding</label>

            <input
              type="checkbox"
              id="gender-reveal"
              onChange={() => filterPosts("gender-reveal")}
            />
            <label for="gender-reveal">Gender Reveal</label>

            <input
              type="checkbox"
              id="parenting-tips"
              onChange={() => filterPosts("parenting-tips")}
            />
            <label for="parenting-tips">Parenting Tips</label>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BellyTalk;
