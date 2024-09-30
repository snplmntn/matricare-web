import { useState } from "react";
import { IoBookmark, IoHeart, IoLocationSharp } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import { useNavigate } from "react-router-dom";

const BellyTalkPost = ({ post }) => {
  const token = getCookie("token");

  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentText, setCommentText] = useState("");

  const handleLike = (postId) => {
    if (!token) {
      navigate("/login");
    }
    setLikedPosts((prevLikedPosts) =>
      prevLikedPosts.includes(postId)
        ? prevLikedPosts.filter((id) => id !== postId)
        : [...prevLikedPosts, postId]
    );
  };

  const handleSave = (postId) => {
    if (!token) {
      navigate("/login");
    }
    setSavedPosts((prevSavedPosts) =>
      prevSavedPosts.includes(postId)
        ? prevSavedPosts.filter((id) => id !== postId)
        : [...prevSavedPosts, postId]
    );
  };

  const handleReply = (postId) => {
    if (!token) {
      navigate("/login");
    }
    setReplyingTo(replyingTo === postId ? null : postId);
  };

  const handleKeyPress = (event, postId) => {
    if (event.key === "Enter") {
      handleCommentPost(postId);
    }
  };

  const handleCommentPost = (postId) => {
    if (!token) {
      navigate("/login");
    }
    if (commentText.trim() === "") {
      return; // Prevent posting empty content
    }
    // const updatedPosts = posts.map((post) => {
    //   if (post.id === postId) {
    //     return {
    //       ...post,
    //       comments: [
    //         ...post.comments,
    //         {
    //           id: post.comments.length + 1,
    //           user: "Your Name", // Replace with actual user name or dynamic user data
    //           text: commentText,
    //         },
    //       ],
    //     };
    //   }
    //   return post;
    // });
    // setPosts(updatedPosts);
    setCommentText("");
    setReplyingTo(null);
  };

  return (
    <div className="bellytalk-feed-item" key={post.id}>
      <img
        src="img/topic1.jpg"
        alt="Avatar"
        className="bellytalk-avatar-overlay"
      />
      <div className="bellytalk-post-content">
        <h4>{post.fullname}</h4>
        <div className="location-with-icon">
          <IoLocationSharp />
          <p>{post.address}</p>
        </div>
        <p>{post.content}</p>
        {post.image && (
          <img src={post.image} alt="Post" className="post-image" />
        )}
        <hr className="bellytalk-divider" />
        <div className="bellytalk-actions">
          <button
            className="bellytalk-action-button"
            onClick={() => handleReply(post.id)}
          >
            Reply
          </button>
          <IoHeart
            className={`bellytalk-action-icon ${
              likedPosts.includes(post.id) ? "active" : ""
            }`}
            onClick={() => handleLike(post.id)}
          />
          <IoBookmark
            className={`bellytalk-action-icon ${
              savedPosts.includes(post.id) ? "active" : ""
            }`}
            onClick={() => handleSave(post.id)}
          />
        </div>
        {replyingTo === post.id && (
          <div className="bellytalk-reply-container">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="bellytalk-reply-input"
              onKeyPress={(e) => handleKeyPress(e, post.id)} // Handle Enter key press
            />
          </div>
        )}
        {/* {post.comments.map((comment) => (
                  <div className="bellytalk-comment" key={comment.id}>
                    <div className="comment-user-info">
                      <img
                        src="img/LOGO.png"
                        alt="User Avatar"
                        className="comment-avatar"
                      />
                      <div>
                        <h4>{comment.user}</h4>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))} */}
      </div>
    </div>
  );
};

export default BellyTalkPost;
