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

  //will enable user to open the input in reply
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
        const response = await axios.post(`${API_URL}/post/like`, postLike, {
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
        const response = await axios.delete(
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
      return; // Prevent posting empty content
    }

    try {
      const commentForm = {
        profilePicture: user.current.profilePicture,
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
          isVerified: comment.userId ? comment.userId.isVerified : false, // Add verification status here
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
    <div className="bellytalk-feed-item" key={post.id}>
      <img
        src={`${
          post.userId && post.userId.profilePicture
            ? `${post.userId.profilePicture}`
            : "img/profilePicture.jpg"
        }`}
        alt="Avatar"
        className="bellytalk-avatar-overlay"
      />
      <div className="bellytalk-post-content">
        <div className="bellytalk-post-header">
          <h4>
            {post.fullname}
            {post.userId && post.userId.verified && (
              <MdVerified className="verified-icon" />
            )}
          </h4>
          {post.userId && post.userId._id === userID && (
            <>
              <IoEllipsisVertical
                className="bellytalk-menu-icon"
                onClick={toggleMenu}
              />
            </>
          )}
          {isMenuOpen && (
            <ul className="bellytalk-meatball-menu">
              <li
                onClick={() => {
                  handleEditPost();
                  handleItemClick();
                }}
              >
                Edit Post
              </li>
              <li
                onClick={() => {
                  handleDeletePost();
                  handleItemClick();
                }}
              >
                Delete Post
              </li>
            </ul>
          )}
        </div>

        <div className="location-with-icon">
          <IoLocationSharp />
          <p>{post.address}</p>
        </div>

        {isEditing ? (
          <div>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="bellytalk-edit-input"
            />
            <button className="bellytalk-edit-save" onClick={handleSaveEdit}>
              Save
            </button>
            <button
              className="bellytalk-edit-cancel"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <p>{post.content}</p>
        )}

        {Array.isArray(post.picture)
          ? post.picture.map((pic, index) => (
              <img
                key={index}
                src={pic}
                alt={`Post ${index}`}
                className="bt-post-image"
              />
            ))
          : post.picture && (
              <img src={post.picture} alt="Post" className="bt-post-image" />
            )}
        <hr className="bellytalk-divider" />
        <div className="bellytalk-actions">
          <button className="bellytalk-action-button" onClick={handleReply}>
            <IoChatbubbleSharp />
          </button>
          {commentsCount > 0 && (
            <span className="bellytalk-action-count">{commentsCount}</span>
          )}

          <IoHeart
            className={`bellytalk-action-icon`}
            style={{ color: isLikedByMe ? "#e39fa9" : "#9a6cb4" }}
            onClick={() => {
              setIsLikedByMe(!isLikedByMe);
              handlePostLike();
            }}
          />
          {likesCount > 0 && (
            <span className="bellytalk-action-count">{likesCount}</span>
          )}

          <IoBookmark
            className={`bellytalk-action-icon`}
            style={{ color: isSavedByMe ? "#e39fa9" : "#9a6cb4" }}
            onClick={() => handleSave(post.id)}
          />
        </div>

        {openReply && (
          <div className="bellytalk-reply-container">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bellytalk-reply-input"
              onKeyPress={(e) => handleKeyPress(e)} // Handle Enter key press
            />
          </div>
        )}
        {comments &&
          comments.map((comment, index) => (
            <div
              key={comment._id ? comment._id : index}
              className="bellytalk-comment"
            >
              <div className="comment-user-info">
                <img
                  src={
                    comment.userId && comment.userId.profilePicture
                      ? comment.userId.profilePicture
                      : "img/profilePicture.jpg"
                  }
                  alt="User Avatar"
                  className="comment-avatar"
                />
                <div>
                  <h4>{comment.fullName}</h4>
                  {comment.userId && comment.userId.verified && (
                    <MdVerified className="verified-icon" />
                  )}
                  <p>{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BellyTalkPost;
