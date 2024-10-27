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
  const [savedPosts, setSavedPosts] = useState([]);
  const [fetching, setIsFetching] = useState(false);

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

  async function fetchSavedPost() {
    if (fetching) return;
    setIsFetching(true);

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
    } catch (error) {
      console.error(error);
    }
    setIsFetching(false);
  }

  useEffect(() => {
    fetchSavedPost();
  }, [API_URL, token, userID]);

  useEffect(() => {
    fetchSavedPost();
  }, []);

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
                  src={
                    post.userId && post.userId.profilePicture
                      ? post.userId.profilePicture
                      : "img/profilePicture.jpg"
                  }
                  alt={post.fullname}
                  className="post-image"
                />
                <div className="post-details">
                  <h3>{post.fullname}</h3>
                  <div className="post-meta">
                    <span className="news-category">
                      {post.category?.join(", ")}
                    </span>
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
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="savedpost-feed-item">
            <div className="savedpost-post-header">
              <img
                src={
                  selectedPost.userId && selectedPost.userId.profilePicture
                    ? `${selectedPost.userId.profilePicture}`
                    : "img/profilePicture.jpg"
                }
                alt={selectedPost.fullname}
                className="savedpost-avatar-overlay"
              />
              <h4 className="savedpost-fullname">{selectedPost.fullname}</h4>
            </div>
            <div className="savedpost-post-content">
              <p>{selectedPost.content}</p>
              {Array.isArray(selectedPost.picture)
                ? selectedPost.picture.map((pic, index) => (
                    <img
                      key={index}
                      src={pic}
                      alt={`Post ${index}`}
                      className="post-image"
                    />
                  ))
                : selectedPost.picture && (
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
