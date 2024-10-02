import { useEffect, useState } from "react";
import { IoBookmark, IoHeart, IoLocationSharp } from "react-icons/io5";
import { getCookie } from "../../../utils/getCookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BellyTalkPost = ({ post, user }) => {
  const token = getCookie("token");
  const userID = getCookie("userID");

  const navigate = useNavigate();
  // const [likedPosts, setLikedPosts] = useState([]);
  // const [postLikes, setPostLikes] = useState();
  const [savedPosts, setSavedPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLikedByMe, setIsLikedByMe] = useState(false);
  const [comments, setComments] = useState([]);

  //will enable user to open the input in reply
  const [openReply, setOpenReply] = useState(false);

  const handlePostLike = async () => {
    if (!token) {
      navigate("/login");
    }

    // setIsLikedByMe(!isLikedByMe);
    // console.log(isLikedByMe);
    if (!isLikedByMe) {
      //like post
      try {
        const postLike = {
          userId: userID,
          postId: post._id,
        };
        const response = await axios.post(
          "https://api.matricare.site/api/post/like",
          postLike,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    } else {
      //unlike posts
      try {
        const response = await axios.delete(
          `https://api.matricare.site/api/post/like?userId=${userID}&postId=${post._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSave = () => {
    if (!token) {
      navigate("/login");
    }
    // setSavedPosts((prevSavedPosts) =>
    //   prevSavedPosts.includes(postId)
    //     ? prevSavedPosts.filter((id) => id !== postId)
    //     : [...prevSavedPosts, postId]
    // );
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
        profilePicture: "66f6fbf00e6758da904b5650",
        userId: userID,
        fullname: user.current.name,
        postId: post._id,
        content: commentText,
      };
      const response = await axios.post(
        "https://api.matricare.site/api/post/comment",
        commentForm,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setComments([commentForm, ...comments]);
    } catch (error) {
      console.error(error);
    }
    setCommentText("");
    setOpenReply(false);
    // setReplyingTo(null);
  };

  //fetch likes
  useEffect(() => {
    async function fetchPostLike() {
      try {
        const response = await axios.get(
          `https://api.matricare.site/api/post/like?postId=${post._id}`,

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
          `https://api.matricare.site/api/post/comment?postId=${post._id}`,

          {
            headers: {
              Authorization: token,
            },
          }
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error(error);
      }
    }
    fetchComments();
  }, []);

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
        {post.picture && (
          <img src={post.picture} alt="Post" className="post-image" />
        )}
        <hr className="bellytalk-divider" />
        <div className="bellytalk-actions">
          <button className="bellytalk-action-button" onClick={handleReply}>
            Reply
          </button>
          <IoHeart
            className={`bellytalk-action-icon`}
            style={{ color: isLikedByMe ? "#e39fa9" : "#9a6cb4" }}
            onClick={() => {
              setIsLikedByMe(!isLikedByMe);
              handlePostLike();
            }}
          />
          <IoBookmark
            className={`bellytalk-action-icon ${
              savedPosts.includes(post.id) ? "active" : ""
            }`}
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
                  src="img/LOGO.png"
                  alt="User Avatar"
                  className="comment-avatar"
                />
                <div>
                  <h4>{comment.fullname}</h4>
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
