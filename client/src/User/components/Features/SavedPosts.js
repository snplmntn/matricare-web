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

const SavedPosts = () => {
  const token = getCookie("token");
  const userID = getCookie("userID");
  const API_URL = process.env.REACT_APP_API_URL;
  const [selectedPost, setSelectedPost] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);

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
        const response = await axios.get(`${API_URL}/user?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
        setSavedPosts(response.data.other.savedPost);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSavedPost();
  }, [API_URL, token, userID]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f2eeee]">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-5 bg-white w-full h-20 px-4 sm:px-8">
        <div className="text-2xl sm:text-3xl font-bold text-[#7c459c] ml-0 sm:ml-20">
          BellyTalk
        </div>
        <div className="relative flex items-center w-2/3 sm:w-1/3 rounded-2xl mr-0 sm:mr-20">
          <IoSearch className="absolute left-4 text-base text-[#042440] z-10" />
          <input
            type="text"
            className="pl-10 pr-4 py-2 rounded-2xl border border-[#042440] outline-none w-full text-sm sm:text-base"
            placeholder="Search for people, insights and more..."
          />
        </div>
      </div>

      {savedPosts.length > 0 ? (
        <div>
          <button
            className="flex items-center gap-1 bg-transparent text-[#042440] border-none text-base sm:text-lg cursor-pointer mt-2 sm:mt-4 ml-2 sm:ml-20"
            onClick={handleBackClick}
          >
            <IoArrowBack className="text-lg sm:text-xl" /> Back
          </button>
          <div className="flex flex-wrap justify-center w-full px-2 gap-4 sm:gap-6 mt-4">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="flex bg-white border border-gray-200 rounded-lg w-full sm:w-[48%] lg:w-[32%] shadow-md overflow-hidden cursor-pointer mb-4"
                onClick={() => handlePostClick(post)}
              >
                <img
                  src={
                    post.userId && post.userId.profilePicture
                      ? post.userId.profilePicture
                      : "img/profilePicture.jpg"
                  }
                  alt={post.fullname}
                  className="w-24 h-24 sm:w-36 sm:h-36 object-cover"
                />
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-base sm:text-lg font-semibold mb-1">
                    {post.fullname}
                  </h3>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span className="bg-[#eef] px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span>
                      {post.createdAt &&
                        new Date(post.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1 text-[#7c459c]">
                      <IoHeart /> {post.likes.length}
                    </span>
                    <span className="flex items-center gap-1 text-[#7c459c]">
                      <IoChatbubbleOutline /> {post.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No saved posts available.
        </p>
      )}

      {/* Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg p-4 w-[95vw] max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={
                  selectedPost.userId && selectedPost.userId.profilePicture
                    ? `${selectedPost.userId.profilePicture}`
                    : "img/profilePicture.jpg"
                }
                alt={selectedPost.fullname}
                className="w-14 h-14 rounded-full object-cover"
              />
              <h4 className="text-lg font-bold">{selectedPost.fullname}</h4>
            </div>
            <div>
              <p className="mb-2">{selectedPost.content}</p>
              {selectedPost.picture && (
                <img
                  src={selectedPost.picture}
                  alt="Post"
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <hr className="my-3 border-gray-200" />
              <div className="flex items-center gap-4 justify-end">
                {/* Add actions if needed */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
