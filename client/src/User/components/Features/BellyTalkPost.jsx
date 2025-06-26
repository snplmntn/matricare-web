import { useEffect, useState } from "react";
import {
  IoBookmark,
  IoHeart,
  IoLocationSharp,
  IoEllipsisVertical,
  IoChatbubbleSharp,
} from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { getCookie } from "../../../utils/getCookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BellyTalkPost = ({ post, user, onDeletePost }) => {
  const token = getCookie("token");
  const userID = getCookie("userID");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCaption, setNewCaption] = useState(post.content);
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [isLikedByMe, setIsLikedByMe] = useState(false);
  const [isSavedByMe, setIsSavedByMe] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;
  const [openReply, setOpenReply] = useState(false);

  const handleItemClick = () => {
    setIsMenuOpen(false);
  };

  const handlePostLike = async () => {
    if (!token) {
      navigate("/login");
    }

    if (isLiking) return;
    setIsLiking(true);

    if (!isLikedByMe) {
      setIsLikedByMe(!isLikedByMe);
      //like post
      try {
        const postLike = {
          userId: userID,
          postId: post._id,
        };
        await axios.post(`${API_URL}/post/like`, postLike, {
          headers: {
            Authorization: token,
          },
        });
        setLikesCount((prevCount) => prevCount + 1);
        setIsLiking(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      //unlike posts
      try {
        setIsLikedByMe(!isLikedByMe);
        await axios.delete(
          `${API_URL}/post/like?userId=${userID}&postId=${post._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setLikesCount((prevCount) => prevCount - 1); // Decrement likes count
        setIsLiking(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSave = async () => {
    if (!token) {
      navigate("/login");
    }

    if (isSaving) return;
    setIsSaving(true);

    if (!isSavedByMe) {
      setIsSavedByMe(!isSavedByMe);
      try {
        await axios.get(
          `${API_URL}/user/save?userId=${userID}&postId=${post._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setIsSaving(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsSavedByMe(!isSavedByMe);
      try {
        await axios.delete(
          `${API_URL}/user/unsave?userId=${userID}&postId=${post._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setIsSaving(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  //will validate if there is a token, if token, you can reply
  const handleReply = () => {
    if (!token) {
      navigate("/login");
    }
    setOpenReply(!openReply);
  };

  function containsBadWord(text) {
    const badWords = [
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
      "ulol",
      "sira",
      "pesteng yawa",
      "bwakanangina",
    ];

    text = text.toLowerCase();

    for (const word of badWords) {
      if (text.includes(word)) {
        return true; // Bad word found
      }
    }

    return false; // No bad words found
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleCommentPost();
    }
  };

  const handleCommentPost = async () => {
    if (!token) {
      navigate("/login");
    }

    if (commentText.trim() === "") {
      return alert("Comment cannot be empty."); // Prevent posting empty content
    }

    if (containsBadWord(commentText)) {
      return alert(
        "Comment contains bad words. Please edit your post to remove bad words."
      );
    }

    try {
      const commentForm = {
        userId: userID,
        fullName: user.current.name,
        postId: post._id,
        content: commentText,
      };
      const response = await axios.post(
        `${API_URL}/post/comment`,
        commentForm,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setComments([response.data.comment, ...comments]);
      setCommentsCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error(error);
    }
    setCommentText("");
    setOpenReply(false);
  };

  //fetch likes
  useEffect(() => {
    async function fetchPostLike() {
      try {
        const response = await axios.get(
          `${API_URL}/post/like?postId=${post._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        //will change the ui if this post is liked by user
        if (response.data.likes) {
          //this will access all of the likers of the post
          const likedUserIDs = response.data.likes.map((i) => i.userId);
          //will check if the current user is one of those likes
          const liked = likedUserIDs.includes(userID);
          setIsLikedByMe(liked);
        }
        setLikesCount(response.data.likes.length);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPostLike();
  }, [isLikedByMe]);

  //fetch comments in a post
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await axios.get(
          `${API_URL}/${token ? "post" : "bellytalk"}/comment?postId=${
            post._id
          }`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const fetchedComments = response.data.comments.map((comment) => ({
          ...comment,
          isVerified: comment?.userId?.verified || false,
        }));

        setComments(fetchedComments);
        setCommentsCount(response.data.comments.length);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchSavedPost() {
      try {
        const response = await axios.get(`${API_URL}/user?userId=${userID}`, {
          headers: {
            Authorization: token,
          },
        });
        const savedIds = response.data.other.savedPost.map((post) => post._id);
        const saved = savedIds.includes(post._id);
        setIsSavedByMe(saved);
      } catch (error) {
        console.error(error);
      }
    }

    fetchComments();
    fetchSavedPost();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditPost = () => {
    setIsEditing(true);
    setNewCaption(post.content);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedPost = {
        postId: post._id,
        content: newCaption,
      };
      await axios.put(`${API_URL}/post`, updatedPost, {
        headers: {
          Authorization: token,
        },
      });
      setIsEditing(false); // Close the edit mode
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async () => {
    if (!token) {
      navigate("/login");
    }

    try {
      await axios.delete(`${API_URL}/post?id=${post._id}`, {
        headers: {
          Authorization: token,
        },
      });
      onDeletePost(post._id); // Call the onDeletePost function to remove the post from the UI
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative mt-5 p-3 sm:p-5 rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.1)] bg-white flex flex-col md:flex-row items-start">
      {/* Avatar */}
      <img
        src={
          post.userId && post.userId.profilePicture
            ? `${post.userId.profilePicture}`
            : "img/profilePicture.jpg"
        }
        alt="Avatar"
        className="absolute -top-5 left-3 md:-left-5 w-12 h-12 md:w-[60px] md:h-[60px] rounded-full object-cover z-10"
      />
      {/* Post Content */}
      <div className="ml-0 md:ml-10 w-full md:w-[95%] mt-8 md:mt-0">
        {/* Header */}
        <div className="flex justify-between items-center relative flex-wrap">
          <h4 className="m-0 text-[#7c459c] font-bold flex items-center text-base sm:text-lg">
            {post.fullname}
            {post.userId && post.userId.verified && (
              <MdVerified className="ml-1 text-[#6b95e5]" />
            )}
          </h4>
          {post.userId && post.userId._id === userID && (
            <>
              <IoEllipsisVertical
                className="text-xl sm:text-2xl text-[#888] cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </>
          )}
          {isMenuOpen && (
            <ul className="absolute top-8 right-0 bg-white border border-[#ddd] rounded-lg shadow-lg list-none p-0 w-32 sm:w-[150px] z-50">
              <li
                className="px-3 sm:px-4 py-2 text-sm text-[#333] cursor-pointer hover:bg-[#f5f5f5] border-b border-[#f5f5f5] last:border-b-0"
                onClick={() => {
                  setIsEditing(true);
                  setNewCaption(post.content);
                  setIsMenuOpen(false);
                }}
              >
                Edit Post
              </li>
              <li
                className="px-3 sm:px-4 py-2 text-sm text-[#333] cursor-pointer hover:bg-[#f5f5f5]"
                onClick={() => {
                  onDeletePost(post._id);
                  setIsMenuOpen(false);
                }}
              >
                Delete Post
              </li>
            </ul>
          )}
        </div>
        {/* Location */}
        <div className="flex items-center mb-1 text-[#e39fa9] text-xs sm:text-sm mt-1">
          <IoLocationSharp className="mr-1" />
          <p className="m-0">{post.address}</p>
        </div>
        {/* Content or Edit */}
        {isEditing ? (
          <div>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="w-full md:w-[80%] p-2 sm:p-3 border-none rounded text-xs sm:text-sm mb-2 sm:mb-4 resize-y bg-gray-100"
            />
            <div className="flex flex-wrap gap-2">
              <button
                className="bg-[#e39fa9] text-[#333] border-none px-4 sm:px-8 py-1 sm:py-2 text-xs sm:text-sm rounded"
                onClick={async () => {
                  // handleSaveEdit logic here
                  setIsEditing(false);
                }}
              >
                Save
              </button>
              <button
                className="bg-[#e39fa9] text-[#333] border-none px-4 sm:px-8 py-1 sm:py-2 text-xs sm:text-sm rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="my-1 text-sm sm:text-base">{post.content}</p>
        )}
        {/* Images */}
        {Array.isArray(post.picture)
          ? post.picture.map((pic, index) => (
              <img
                key={index}
                src={pic}
                alt={`Post ${index}`}
                className="w-full md:w-[500px] max-w-full h-auto rounded mb-2"
              />
            ))
          : post.picture && (
              <img
                src={post.picture}
                alt="Post"
                className="w-full md:w-[500px] max-w-full h-auto rounded mb-2"
              />
            )}
        {/* Divider */}
        <hr className="border-0 h-[1px] bg-[#e0e0e0] my-3 sm:my-4" />
        {/* Actions */}
        <div className="flex items-center gap-2 md:ml-[550px]">
          <button
            className="text-[18px] sm:text-[20px] text-[#9a6cb4] cursor-pointer bg-transparent border-none mt-1 hover:text-[#e39fa9]"
            onClick={() => setOpenReply(!openReply)}
          >
            <IoChatbubbleSharp />
          </button>
          {commentsCount > 0 && (
            <span className="text-xs sm:text-sm text-[#9a6cb4]">
              {commentsCount}
            </span>
          )}
          <IoHeart
            className={`text-[18px] sm:text-[20px] cursor-pointer transition-colors duration-200 ${
              isLikedByMe ? "text-[#e39fa9]" : "text-[#9a6cb4]"
            } hover:text-[#e39fa9]`}
            onClick={async () => {
              await handlePostLike();
              console.log("Like result:", isLikedByMe);
            }}
          />
          {likesCount > 0 && (
            <span className="text-xs sm:text-sm text-[#9a6cb4]">
              {likesCount}
            </span>
          )}
          <IoBookmark
            className={`text-[18px] sm:text-[20px] cursor-pointer transition-colors duration-200 ${
              isSavedByMe ? "text-[#e39fa9]" : "text-[#9a6cb4]"
            } hover:text-[#e39fa9]`}
            onClick={async () => {
              await handleSave();
              console.log("Save result:", isSavedByMe);
            }}
          />
        </div>
        {/* Reply Input */}
        {openReply && (
          <div className="relative">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full md:w-[60%] p-2 border-none bg-transparent text-xs sm:text-sm absolute -mt-10 z-10"
              onKeyPress={handleKeyPress} // Fix: pass event directly
            />
          </div>
        )}
        {/* Comments */}
        {comments &&
          comments.map((comment, index) => (
            <div
              key={comment._id ? comment._id : index}
              className="mb-4 sm:mb-6"
            >
              <div className="flex items-start">
                <img
                  src={
                    comment.userId && comment.userId.profilePicture
                      ? comment.userId.profilePicture
                      : "img/profilePicture.jpg"
                  }
                  alt="User Avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2"
                />
                <div>
                  <div className="flex items-center">
                    <h4 className="text-xs sm:text-base font-semibold m-0">
                      {comment.fullName}
                    </h4>
                    {comment.userId && comment.userId.verified && (
                      <span>
                        <MdVerified className="ml-1 text-[#6b95e5]" />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BellyTalkPost;
