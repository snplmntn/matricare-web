import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IoChatbubbleOutline,
  IoSearch,
  IoArrowBack,
  IoHeart,
} from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import { useNavigate } from "react-router-dom";
import "../../styles/features/savedPosts.css";

const SavedPosts = () => {
  const token = getCookie("token");
  const userID = getCookie("userID");
  const API_URL = process.env.REACT_APP_API_URL;
  const [selectedPost, setSelectedPost] = useState(null);
  const [savedPosts, setSavedPosts] = useState([
    // Static sample posts
    {
      id: 1,
      imageUrl: "img/topic1.jpg",
      fullname: "Ella Diaz",
      content: "Hi",
      category: "Breast Feeding",
      likes: 10,
      comments: 1,
      time: "2:00 pm",
    },
    {
      id: 2,
      imageUrl: "img/topic2.jpg",
      fullname: "Bea Rosal",
      content: "Hi",
      category: "Maternal Style",
      likes: 20,
      comments: 3,
      time: "2:00 pm",
    },
    {
      id: 3,
      imageUrl: "img/topic3.jpg",
      fullname: "Maxene Delos Santos",
      content: "Hi",
      category: "Gender Reveal",
      likes: 20,
      comments: 1,
      time: "2:00 pm",
    },
    {
      id: 4,
      imageUrl: "img/topic4.jpg",
      fullname: "Alexandra Tomas",
      content: "Hi",
      category: "Labor",
      likes: 40,
      comments: 20,
      time: "2:00 pm",
    },
    {
      id: 5,
      imageUrl: "img/topic5.jpg",
      fullname: "Alexis Rodriguez",
      content: "Hi",
      category: "Baby Essentials",
      likes: 10,
      comments: 4,
      time: "2:00 pm",
    },
    {
      id: 6,
      imageUrl: "img/topic5.jpg",
      fullname: "Stefanie Rengel",
      content: "Hi",
      category: "Gender Reveal",
      likes: 10,
      comments: 1.4,
      time: "2:00 pm",
    },
  ]);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/belly-talk");
  };

  const handlePostClick = (post) => {
    setSelectedPost(post); // Set the selected post for the modal
  };

  const handleCloseModal = () => {
    setSelectedPost(null); // Close the modal
  };

  useEffect(() => {
    // Fetch saved posts when the component loads
    async function fetchSavedPost() {
      try {
        const response = await axios.get(
          `${API_URL}/user?userId=${userID}`,

          {
            headers: {
              Authorization: token,
            },
          }
        );
        setSavedPosts(response.data.other.savedPost);
        console.log(response.data.other.savedPost);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSavedPost();
  }, [API_URL, token, userID]);

  return (
    <div className="saved-posts-page">
      <div className="bellytalk-top-bar">
        <div className="bellytalk-title-logo">BellyTalk</div>
        <div className="bellytalk-search-container">
          <IoSearch className="bellytalk-search-icon" />
          <input
            type="text"
            className="bellytalk-search"
            placeholder="Search for people, insights and more..."
          />
        </div>
      </div>
      {savedPosts.length > 0 ? (
        <div>
          <button className="SP-back-button" onClick={handleBackClick}>
            {" "}
            <IoArrowBack /> Back{" "}
          </button>
          <div className="saved-posts-container">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="saved-post-card"
                onClick={() => handlePostClick(post)}
              >
                <img
                  src={post.userId && post.userId.profilePicture}
                  alt={post.fullname}
                  className="post-image"
                />
                <div className="post-details">
                  <h3>{post.fullname}</h3>
                  <div className="post-meta">
                    <span className="news-category">{post.category}</span>
                    <span className="post-time">
                      {post.createdAt &&
                        new Date(post.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </div>
                  <div className="post-reactions">
                    <span>
                      <IoHeart /> {post.likes.length}
                    </span>
                    <span>
                      <IoChatbubbleOutline /> {post.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No saved posts available.</p>
      )}

      {selectedPost && (
        <div className="modal-overlay">
          <div className="savedpost-feed-item">
            <div className="savedpost-post-header">
              <img
                src={selectedPost.userId && selectedPost.userId.profilePicture}
                alt={selectedPost.fullname}
                className="savedpost-avatar-overlay"
              />
              <h4 className="savedpost-fullname">{selectedPost.fullname}</h4>
            </div>
            <div className="savedpost-post-content">
              <p>{selectedPost.content}</p>
              {selectedPost.picture && (
                <img
                  src={selectedPost.picture}
                  alt="Post"
                  className="post-image"
                />
              )}
              <hr className="savedpost-divider" />
              <div className="savedpost-actions"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
