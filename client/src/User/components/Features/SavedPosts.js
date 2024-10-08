import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoChatbubbleOutline, IoSearch, IoArrowBack, IoHeart  } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import { useNavigate } from 'react-router-dom';
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
    navigate('/belly-talk'); 
  };

  const handlePostClick = (post) => {
    setSelectedPost(post); // Set the selected post for the modal
  };

  const handleCloseModal = () => {
    setSelectedPost(null); // Close the modal
  };
  
  useEffect(() => {
    // Fetch saved posts when the component loads
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/saved-posts/${userID}`, {
          headers: { Authorization: token },
        });
        setSavedPosts(response.data);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    fetchSavedPosts();
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
        <div><button className="SP-back-button" onClick={handleBackClick}> <IoArrowBack/> Back </button>
        <div className="saved-posts-container">
          {savedPosts.map((post) => (
            <div key={post.id} className="saved-post-card" onClick={() => handlePostClick(post)}>
              <img src={post.imageUrl} alt={post.fullname} className="post-image" />
              <div className="post-details">
                <h3>{post.fullname}</h3>
                <div className="post-meta">
                  <span className="news-category">{post.category}</span>
                  <span className="post-time">2:00 pm</span>
                </div>
                <div className="post-reactions">
                  <span>
                    <IoHeart /> {post.likes}
                  </span>
                  <span>
                    <IoChatbubbleOutline /> {post.comments}
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
                src={selectedPost.imageUrl}
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
