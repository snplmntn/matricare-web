import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { getCookie } from "../../../utils/getCookie";
import { useNavigate } from "react-router-dom";
import BellyTalkPost from "./BellyTalkPost";
import {
  IoSearch,
  IoBookmark,
  IoPencil,
  IoArrowBack,
  IoPersonCircle,
  IoFilter,
} from "react-icons/io5";
import { FcPicture } from "react-icons/fc";
import PostSkeleton from "./PostSkeleton";
import { useInView } from "react-intersection-observer";
import { useCookies } from "react-cookie";
import axios from "axios";

// Constants
const BAD_WORDS = [
  "damn",
  "hell",
  "bitch",
  "bastard",
  "crap",
  "shit",
  "asshole",
  "douche",
  "freaking",
  "fuck",
  "fucked",
  "fucker",
  "fucking",
  "motherfucker",
  "prick",
  "dick",
  "dickhead",
  "piss",
  "pissed",
  "slut",
  "whore",
  "cock",
  "suck",
  "retard",
  "loser",
  "idiot",
  "stupid",
  "putangina",
  "gago",
  "tangina",
  "bobo",
  "puki",
  "kantot",
  "tanga",
  "tarantado",
  "ulol",
  "inutil",
  "leche",
  "lintik",
  "bwisit",
  "siraulo",
  "pakshet",
  "hinayupak",
  "sagad",
  "hayop",
  "kupal",
  "sira",
  "pesteng yawa",
  "bwakanangina",
];

const BellyTalk = ({ user }) => {
  // Hooks
  const [cookies, setCookie, removeCookie] = useCookies();
  const { ref: myRef, inView: fetchPost } = useInView();
  const navigate = useNavigate();

  // Constants from cookies/env
  const token = useMemo(() => getCookie("token"), []);
  const userID = useMemo(() => getCookie("userID"), []);
  const API_URL = useMemo(() => process.env.REACT_APP_API_URL, []);

  // State management
  const [state, setState] = useState({
    posts: [],
    allPost: [],
    newPostText: "",
    selectedImage: [],
    imagePreview: [],
    successMessage: "",
    activeFilters: [],
    searchTerm: "",
    loading: false,
    showLoading: true,
    fetchAgain: false,
    isPosting: false,
  });

  const [ui, setUI] = useState({
    isModalOpen: false,
    isOpen: false,
    isFilterOpen: false,
    step: 1,
  });

  // Dynamic filter options based on post categories
  const filterOptions = useMemo(() => {
    if (!state.allPost || state.allPost.length === 0) {
      return [{ id: "all", label: "All", filter: "All" }];
    }

    // Extract unique categories from posts
    const uniqueCategories = new Set();

    state.allPost.forEach((post) => {
      if (post.category) {
        if (Array.isArray(post.category)) {
          post.category.forEach((cat) => uniqueCategories.add(cat));
        } else {
          uniqueCategories.add(post.category);
        }
      }
    });

    // Convert to filter options format
    const dynamicFilters = Array.from(uniqueCategories)
      .filter((category) => category && category.trim() !== "") // Remove empty categories
      .sort() // Sort alphabetically
      .map((category) => ({
        id: category
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        label: category,
        filter: category,
      }));

    // Always include "All" as the first option
    return [{ id: "all", label: "All", filter: "All" }, ...dynamicFilters];
  }, [state.allPost]);

  // Utility functions
  const containsBadWord = useCallback((text) => {
    const lowerText = text.toLowerCase();
    return BAD_WORDS.some((word) => lowerText.includes(word));
  }, []);

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateUI = useCallback((updates) => {
    setUI((prev) => ({ ...prev, ...updates }));
  }, []);

  // Modal handlers
  const openModal = useCallback(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    updateUI({ isModalOpen: true, step: 1 });
    updateState({
      newPostText: "",
      selectedImage: [],
      imagePreview: [],
      isPosting: false,
    });
  }, [token, navigate, updateUI, updateState]);

  const closeModal = useCallback(() => {
    updateUI({ isModalOpen: false, step: 1 });
    updateState({
      newPostText: "",
      selectedImage: [],
      imagePreview: [],
      isPosting: false,
    });
  }, [updateUI, updateState]);

  // Image handling
  const handleRemoveImage = useCallback(
    (index) => {
      updateState({
        selectedImage: state.selectedImage.filter((_, i) => i !== index),
        imagePreview: state.imagePreview.filter((_, i) => i !== index),
      });
    },
    [state.selectedImage, state.imagePreview, updateState]
  );

  const handleFileChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      const previews = files.map((file) => URL.createObjectURL(file));

      updateState({
        selectedImage: [...files, ...state.selectedImage],
        imagePreview: [...previews, ...state.imagePreview],
      });
    },
    [state.selectedImage, state.imagePreview, updateState]
  );

  const uploadImages = useCallback(async () => {
    if (!state.selectedImage?.length) return null;

    const formData = new FormData();
    state.selectedImage.forEach((image) => formData.append("picture", image));

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
      console.error("Image upload failed:", error);
      return null;
    }
  }, [state.selectedImage, API_URL, userID, token]);

  // Post submission
  const handlePostSubmit = useCallback(async () => {
    const { newPostText } = state;

    if (!newPostText.trim()) {
      alert("Post content cannot be empty.");
      return;
    }

    if (containsBadWord(newPostText)) {
      alert(
        "Post contains bad words. Please edit your post to remove bad words."
      );
      return;
    }

    updateState({ isPosting: true });

    try {
      const imgLink = await uploadImages();
      if (state.selectedImage?.length && !imgLink) {
        alert("Image upload failed. Please try again.");
        return;
      }

      const newPost = {
        userId: userID,
        fullname: user.current.name,
        content: newPostText,
        address: "Manila City",
        picture: imgLink,
      };

      const response = await axios.post(`${API_URL}/post/`, newPost, {
        headers: { Authorization: token },
      });

      const savedPost = response.data.savedPost;

      updateState({
        posts: [savedPost, ...state.posts],
        allPost: [savedPost, ...state.allPost],
        newPostText: "",
        selectedImage: [],
        imagePreview: [],
        successMessage: "Post Submitted",
        isPosting: false,
      });

      updateUI({ isModalOpen: false });
    } catch (error) {
      console.error("Post submission failed:", error);
      updateState({ isPosting: false });
    }
  }, [
    state,
    containsBadWord,
    uploadImages,
    userID,
    user,
    API_URL,
    token,
    updateState,
    updateUI,
  ]);

  // Data fetching
  const fetchPosts = useCallback(async () => {
    if (state.loading) return;

    updateState({ loading: true });

    const lastPostId =
      state.allPost.length > 0
        ? state.allPost[state.allPost.length - 1]._id
        : null;

    try {
      const response = await axios.get(
        `${API_URL}/${token ? "post" : "bellytalk"}/i${
          lastPostId ? `?postId=${lastPostId}` : ""
        }`,
        { headers: { Authorization: token } }
      );

      const newPosts = response.data;

      updateState({
        posts: [...state.posts, ...newPosts],
        allPost: [...state.allPost, ...newPosts],
        loading: false,
        showLoading: newPosts.length > 0,
        fetchAgain: false,
      });

      if (newPosts.length > 0) {
        setTimeout(() => updateState({ fetchAgain: true }), 3000);
      }
    } catch (error) {
      console.error("Fetch posts failed:", error);
      updateState({ loading: false });
    }
  }, [state.loading, state.allPost, state.posts, API_URL, token, updateState]);

  // Filter and search
  const handleFilterChange = useCallback(
    (filterType) => {
      updateState({
        activeFilters: state.activeFilters.includes(filterType)
          ? state.activeFilters.filter((filter) => filter !== filterType)
          : [...state.activeFilters, filterType],
      });
    },
    [state.activeFilters, updateState]
  );

  const handleSearchChange = useCallback(
    (e) => {
      updateState({ searchTerm: e.target.value });
    },
    [updateState]
  );

  // Filter posts based on search and active filters
  const filteredPosts = useMemo(() => {
    if (!state.allPost) return [];

    return state.allPost.filter((post) => {
      const matchesSearch =
        !state.searchTerm ||
        [
          post.content,
          post.fullname,
          ...(post.comments?.map((comment) => comment.content) || []),
        ].some((text) =>
          text.toLowerCase().includes(state.searchTerm.toLowerCase())
        );

      const matchesCategory =
        !state.activeFilters.length ||
        state.activeFilters.includes("All") ||
        (post.category &&
          state.activeFilters.some((filter) => {
            if (Array.isArray(post.category)) {
              return post.category.includes(filter);
            } else {
              return post.category === filter;
            }
          }));

      return matchesSearch && matchesCategory;
    });
  }, [state.allPost, state.searchTerm, state.activeFilters]);

  // Navigation handlers
  const handleSavedButtonClick = useCallback(
    () => navigate("/saved-posts"),
    [navigate]
  );
  const handleOpenUserProfile = useCallback(
    () => navigate("/userprofile"),
    [navigate]
  );
  const handleBackButton = useCallback(() => navigate(-1), [navigate]);

  const onDeletePost = useCallback(
    (postId) => {
      updateState({
        posts: state.posts.filter((post) => post._id !== postId),
        allPost: state.allPost.filter((post) => post._id !== postId),
      });
    },
    [state.posts, state.allPost, updateState]
  );

  // Auth handlers
  const handleLogout = useCallback(async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, {
        headers: { Authorization: token },
      });

      // Clear all stored data
      const itemsToRemove = [
        "userData",
        "address",
        "email",
        "events",
        "phoneNumber",
        "profileImageUrl",
        "savedArticles",
        "userName",
      ];
      itemsToRemove.forEach((item) => localStorage.removeItem(item));

      const cookiesToRemove = ["userID", "verifyToken", "role", "token"];
      cookiesToRemove.forEach((cookie) => removeCookie(cookie));

      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  }, [API_URL, token, removeCookie, navigate]);

  // Toggle handlers
  const toggleDropdown = useCallback(
    () => updateUI({ isOpen: !ui.isOpen }),
    [ui.isOpen, updateUI]
  );
  const toggleFilter = useCallback(
    () => updateUI({ isFilterOpen: !ui.isFilterOpen }),
    [ui.isFilterOpen, updateUI]
  );

  // Effects
  useEffect(() => {
    setState((prev) => ({ ...prev, posts: filteredPosts }));
  }, [filteredPosts]);

  useEffect(() => {
    if (fetchPost && !state.loading) {
      fetchPosts();
    }
  }, [fetchPost, state.fetchAgain, fetchPosts, state.loading]);

  // Render helpers
  const renderMobileHeader = () => (
    <div className="flex md:hidden items-center justify-between w-full">
      {user.current?.role !== "Ob-gyne Specialist" && (
        <button
          onClick={handleBackButton}
          className="bg-transparent border-none cursor-pointer text-[#7c459c]"
        >
          <IoArrowBack size={24} />
        </button>
      )}

      <div className="text-xl font-bold text-[#7c459c]">BellyTalk</div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleFilter}
          className="bg-transparent border-none cursor-pointer text-[#7c459c]"
        >
          <IoFilter size={20} />
        </button>

        {user.current?.role === "Ob-gyne Specialist" && (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="bg-transparent border-none cursor-pointer text-[#7c459c]"
            >
              <IoPersonCircle size={24} />
            </button>

            {ui.isOpen && (
              <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded-md w-32 shadow-lg z-50">
                <ul className="list-none p-0 m-0">
                  <li className="p-2 border-b border-gray-300">
                    <button
                      onClick={handleOpenUserProfile}
                      className="w-full text-left text-[#333] hover:bg-gray-100 text-sm"
                    >
                      User Profile
                    </button>
                  </li>
                  <li className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-[#333] hover:bg-gray-100 text-sm"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderDesktopHeader = () => (
    <>
      {/* {user.current?.role !== "Ob-gyne Specialist" && ( */}
      <button
        onClick={handleBackButton}
        className="bg-transparent border-none cursor-pointer ml-0 md:ml-[100px] mr-0 md:mr-[-150px] text-[#7c459c] hidden md:block"
      >
        <IoArrowBack size={30} />
      </button>
      {/* )} */}

      <div className="text-3xl font-bold text-[#7c459c] ml-0 md:ml-[200px] hidden md:block">
        BellyTalk
      </div>

      <div className="hidden md:flex flex-row items-center ml-0 md:ml-[600px]">
        <button
          onClick={handleSavedButtonClick}
          className="flex items-center bg-transparent border-none cursor-pointer p-0 mr-[30px]"
        >
          <IoBookmark className="text-2xl mr-[10px] cursor-pointer text-[#e39fa9]" />
          <span className="text-base text-[#603830] mr-[15px]">Saved</span>
        </button>
      </div>

      <div className="relative hidden md:flex  items-center w-[30%] rounded-[20px] mr-0 md:mr-[200px] ">
        <IoSearch className="absolute left-[15px] text-base text-[#042440] z-[1000]" />
        <input
          type="text"
          className="rounded-[20px] border border-[#042440] outline-none pl-[40px] z-[1] h-[40px] w-[500px] placeholder-[#042440]"
          placeholder="Search for people, insights and more..."
          value={state.searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="relative inline-block hidden md:block">
        <div
          onClick={toggleDropdown}
          className="bg-transparent border-none cursor-pointer text-[#7c459c] absolute right-[120px] text-[40px] top-[-20px]"
        >
          {user.current?.role === "Ob-gyne Specialist" && <IoPersonCircle />}
        </div>

        {ui.isOpen && (
          <div className="absolute top-[35px] right-0 bg-white border border-[#ccc] rounded-[5px] w-[150px] shadow-lg z-[1]">
            <ul className="list-none p-0 m-0">
              <li className="p-[10px] border-b border-[#ddd]">
                <button
                  onClick={handleOpenUserProfile}
                  className="w-full text-left text-[#333] hover:bg-[#f2f2f2]"
                >
                  User Profile
                </button>
              </li>
              <li className="p-[10px]">
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-[#333] hover:bg-[#f2f2f2]"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );

  const renderFilterOptions = (isMobile = false) =>
    filterOptions.map(({ id, label, filter }) => (
      <label
        key={id}
        className={
          isMobile
            ? "flex items-center py-3 cursor-pointer border-b border-gray-100 last:border-b-0"
            : "block my-[5px] cursor-pointer mb-5 mt-5 relative pl-[40px]"
        }
      >
        <input
          type="checkbox"
          id={id}
          onChange={() => handleFilterChange(filter)}
          checked={state.activeFilters.includes(filter)}
          className={
            isMobile
              ? "mr-3 w-4 h-4 text-[#7c459c] rounded focus:ring-[#7c459c]"
              : "hidden peer"
          }
        />
        {!isMobile && (
          <>
            <span className="absolute left-[10px] top-1/2 transform -translate-y-1/2 w-[10px] h-[10px] border-2 border-[#7c459c] rounded-[3px] bg-white transition-colors peer-checked:bg-pink-300 peer-checked:border-pink-300"></span>
            <span className="absolute left-[14px] top-[43%] transform -translate-y-1/2 rotate-45 w-[5px] h-[10px] border-[#042440] border-r-2 border-b-2 opacity-0 peer-checked:opacity-100 transition-opacity"></span>
          </>
        )}
        <span className={isMobile ? "text-sm" : ""}>{label}</span>
      </label>
    ));

  const renderModal = () =>
    ui.isModalOpen && (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] p-4">
        <div className="bg-white p-4 md:p-5 rounded-[20px] w-full max-w-[500px] relative h-auto max-h-[90vh] overflow-y-auto text-base">
          <button
            onClick={closeModal}
            className="text-2xl text-[#7c459c] cursor-pointer absolute left-4 md:left-[30px] top-4 md:top-[35px]"
          >
            <IoArrowBack />
          </button>

          <h2 className="text-xl md:text-2xl text-[#4a4a4a] text-center mb-5 font-bold leading-6 p-[10px] border-b-2 border-[#7c459c]">
            Create a New Talk
          </h2>

          <textarea
            placeholder="What's your experience?"
            value={state.newPostText}
            onChange={(e) => updateState({ newPostText: e.target.value })}
            className="w-full h-32 md:h-full max-h-[200px] rounded-lg border-none mt-[10px] text-base focus:outline-none resize-none"
          />

          <div className="flex items-center mt-8 md:mt-[150px] bg-transparent border border-[#333] rounded-[10px] h-[50px] px-2">
            <p className="ml-3 text-sm md:text-base">Add to your post</p>
            <label
              htmlFor="file-upload"
              className="flex items-center cursor-pointer bg-transparent ml-auto text-2xl md:text-3xl"
            >
              <FcPicture />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
          </div>

          {state.imagePreview?.length > 0 && (
            <div className="mt-4">
              {state.imagePreview.map((preview, index) => (
                <div
                  key={index}
                  className="relative inline-block mt-[10px] w-full md:w-auto"
                >
                  <img
                    src={preview}
                    alt={`Selected ${index}`}
                    className="max-w-full max-h-[200px] md:max-h-[250px] object-contain rounded-[10px] block"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-[10px] right-[10px] text-xl md:text-2xl text-[#040404] cursor-pointer bg-white bg-opacity-80 rounded-full p-[5px] w-[25px] h-[25px] md:w-[30px] md:h-[30px] flex justify-center items-center z-[1] hover:bg-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handlePostSubmit}
            disabled={state.isPosting}
            className="absolute top-4 md:top-[30px] right-4 md:right-[30px] p-[8px] md:p-[10px] border-none bg-transparent text-[#042440] cursor-pointer rounded-[5px] text-sm md:text-base disabled:opacity-50"
          >
            {state.isPosting ? "Posting..." : "Post"}
          </button>

          {state.successMessage && (
            <p className="text-green-600 mt-4">{state.successMessage}</p>
          )}
        </div>
      </div>
    );

  return (
    <div className="flex bg-white h-screen flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-5 bg-white w-full h-[100px] px-4 md:px-0">
        {renderMobileHeader()}
        {renderDesktopHeader()}
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 mb-4">
        <div className="relative flex items-center w-full">
          <IoSearch className="absolute left-3 text-[#042440] z-10" />
          <input
            type="text"
            className="w-full rounded-full border border-[#042440] outline-none pl-10 pr-4 py-2 placeholder-[#042440]"
            placeholder="Search for people, insights..."
            value={state.searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {ui.isFilterOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
          <div className="bg-white w-full max-h-[70vh] overflow-y-auto rounded-t-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={toggleFilter}
                  className="text-gray-500 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4">{renderFilterOptions(true)}</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative m-0 bg-white -mt-5 w-full md:w-[85%] ml-0 md:ml-[140px] scrollbar-hide">
        {/* Share Box */}
        <div className="relative mt-4 md:mt-[70px] mb-5 mx-4 md:ml-[100px]">
          <div className="relative w-full md:w-[925px]" onClick={openModal}>
            <IoPencil className="text-white text-sm absolute left-[10px] top-[22px] md:top-[2px] z-10" />
            <input
              type="text"
              placeholder="What's your experience?"
              value={state.newPostText}
              onChange={(e) => updateState({ newPostText: e.target.value })}
              className="flex-1 rounded-[10px] bg-[#9a6cb4] shadow-lg border-none mt-0 md:-mt-[40px] h-[50px] md:h-[70px] w-full pl-[30px] text-white text-[15px] placeholder-white"
            />
          </div>
        </div>

        {renderModal()}

        {/* Content Container */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* Feed */}
          <section className="flex flex-col gap-[20px] md:gap-[40px] mt-4 md:mt-[50px] w-full md:w-[50%] px-4 md:ml-[150px] md:px-0">
            {state.posts.map((post) => (
              <BellyTalkPost
                key={post._id}
                post={post}
                user={user}
                onDeletePost={onDeletePost}
              />
            ))}

            {state.showLoading && (
              <div ref={myRef}>
                <PostSkeleton cards={2} />
              </div>
            )}
          </section>

          {/* Desktop Filter Section */}
          <div className="hidden md:block absolute w-[420px] left-[1100px] top-0">
            <h3>Filters</h3>
            <div className="bg-white h-[400px] p-[10px] rounded-[5px] shadow-lg overflow-y-auto">
              {filterOptions.length > 1 ? (
                renderFilterOptions()
              ) : (
                <p className="text-gray-500 text-sm p-4">
                  No categories available yet. Filters will appear as posts are
                  added.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Saved Posts Button */}
        <div className="md:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={handleSavedButtonClick}
            className="bg-[#e39fa9] text-white p-3 rounded-full shadow-lg"
          >
            <IoBookmark size={20} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default BellyTalk;
