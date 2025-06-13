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
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/belly-talk");
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter posts based on search term
  const filteredPosts = savedPosts.filter(
    (post) =>
      post.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
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
    <div className="min-h-screen bg-[#9a6cb4cd] flex flex-col">
      {/* Header */}
      <div className="bg-white w-full px-4 py-4 lg:py-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-[#7c459c] hover:text-[#e39fa9] transition-colors"
            >
              <IoArrowBack size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-xl font-bold text-[#7c459c]">Saved Posts</h1>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-[#7c459c] hover:text-[#e39fa9] transition-colors ml-[100px]"
            >
              <IoArrowBack size={24} />
              <span className="text-base font-medium">Back</span>
            </button>
            <h1 className="text-3xl font-bold text-[#7c459c] ml-[50px]">
              Saved Posts
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center w-full lg:w-[30%] lg:mr-[200px]">
            <IoSearch
              className="absolute left-3 text-[#042440] z-10"
              size={16}
            />
            <input
              type="text"
              className="w-full rounded-full lg:rounded-[20px] border border-[#042440] outline-none pl-10 pr-4 py-2 lg:py-3 placeholder-[#042440] text-sm lg:text-base"
              placeholder="Search for people, insights and more..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white lg:bg-[#9a6cb4cd] px-4 lg:px-0">
        <div className="lg:bg-white lg:w-[85%] lg:ml-[140px] lg:mt-[-20px] min-h-full">
          {filteredPosts.length > 0 ? (
            <div className="pt-4 lg:pt-8 pb-6">
              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 lg:px-8">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id || post._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-100"
                    onClick={() => handlePostClick(post)}
                  >
                    {/* Post Image/Avatar */}
                    <div className="relative h-32 lg:h-40 bg-gradient-to-br from-[#9a6cb4] to-[#e39fa9] flex items-center justify-center">
                      <img
                        src={
                          post.userId && post.userId.profilePicture
                            ? post.userId.profilePicture
                            : "/img/profilePicture.jpg"
                        }
                        alt={post.fullname}
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-4 border-white shadow-md"
                      />
                    </div>

                    {/* Post Details */}
                    <div className="p-4">
                      <h3 className="font-semibold text-[#7c459c] text-sm lg:text-base mb-2 truncate">
                        {post.fullname}
                      </h3>

                      {/* Post Content Preview */}
                      <p className="text-gray-600 text-xs lg:text-sm mb-3 line-clamp-2">
                        {post.content}
                      </p>

                      {/* Post Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        {post.category && (
                          <span className="bg-[#e39fa9] text-white px-2 py-1 rounded-full text-xs">
                            {post.category}
                          </span>
                        )}
                        {post.createdAt && (
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Post Reactions */}
                      <div className="flex items-center gap-4 text-xs lg:text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <IoHeart className="text-[#e39fa9]" size={14} />
                          {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <IoChatbubbleOutline
                            className="text-[#9a6cb4]"
                            size={14}
                          />
                          {post.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 lg:h-96 text-center px-4">
              <div className="text-6xl lg:text-8xl mb-4 text-[#9a6cb4] opacity-50">
                📚
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-[#7c459c] mb-2">
                No Saved Posts
              </h2>
              <p className="text-gray-600 text-sm lg:text-base max-w-md">
                {searchTerm
                  ? "No posts match your search criteria. Try adjusting your search terms."
                  : "You haven't saved any posts yet. Start exploring BellyTalk to save posts you love!"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-4 py-2 bg-[#9a6cb4] text-white rounded-lg hover:bg-[#7c459c] transition-colors text-sm"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      selectedPost.userId && selectedPost.userId.profilePicture
                        ? selectedPost.userId.profilePicture
                        : "/img/profilePicture.jpg"
                    }
                    alt={selectedPost.fullname}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-[#7c459c] text-sm lg:text-base">
                      {selectedPost.fullname}
                    </h4>
                    {selectedPost.createdAt && (
                      <p className="text-xs text-gray-500">
                        {new Date(selectedPost.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl lg:text-3xl font-light"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 lg:p-6">
              {/* Category */}
              {selectedPost.category && (
                <div className="mb-4">
                  <span className="inline-block bg-[#e39fa9] text-white px-3 py-1 rounded-full text-xs lg:text-sm">
                    {selectedPost.category}
                  </span>
                </div>
              )}

              {/* Post Content */}
              <div className="mb-6">
                <p className="text-gray-800 text-sm lg:text-base leading-relaxed">
                  {selectedPost.content}
                </p>
              </div>

              {/* Post Image */}
              {selectedPost.picture && (
                <div className="mb-6">
                  <img
                    src={selectedPost.picture}
                    alt="Post content"
                    className="w-full rounded-lg shadow-md max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Divider */}
              <hr className="border-gray-200 mb-4" />

              {/* Post Actions/Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2">
                    <IoHeart className="text-[#e39fa9]" size={18} />
                    <span>{selectedPost.likes?.length || 0} likes</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <IoChatbubbleOutline className="text-[#9a6cb4]" size={18} />
                    <span>{selectedPost.comments?.length || 0} comments</span>
                  </span>
                </div>
                {selectedPost.createdAt && (
                  <span className="text-xs">
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Comments Section (if you want to show them) */}
              {selectedPost.comments && selectedPost.comments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-[#7c459c] mb-3 text-sm lg:text-base">
                    Comments ({selectedPost.comments.length})
                  </h5>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedPost.comments.slice(0, 3).map((comment, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <img
                          src={
                            comment.userId?.profilePicture ||
                            "/img/profilePicture.jpg"
                          }
                          alt={comment.fullname}
                          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#7c459c]">
                            {comment.fullname}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    {selectedPost.comments.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        ... and {selectedPost.comments.length - 3} more comments
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
