import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../style/features/bellytalkAssistant.css';
import { IoPeople, IoDocumentText, IoMail, IoAttach, IoCamera, IoBookmark, IoHeart, IoNavigateOutline, IoChevronBackCircle,  IoRoseSharp, IoLocationSharp } from 'react-icons/io5';

const BellyTalk = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Karyll Cruz',
      location: 'San Jose, Bulacan',
      content: "👶 From the first flutter of kicks to the first giggles, being a mom means experiencing a love so deep it's beyond words. Cherishing these tiny milestones that fill my heart with endless joy.",
      comments: [],
    },
    {
      id: 2,
      user: 'Theresa Neilson',
      location: 'Sampaloc, Manila',
      content: 'Embracing the chaos and cuddles, because thats what makes motherhood magical. From messy mornings to bedtime stories, every moment with my little ones is a precious memory in the making. 💕',
      comments: [],
    },
  ]);
  const [newPostText, setNewPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef(null);

  const handlePost = () => {
    if (newPostText.trim() === '') {
      return; // Prevent posting empty content
    }
    const newPost = {
      id: posts.length + 1, // Generate a unique ID for the new post
      user: 'Your Name', // Replace with actual user name or dynamic user data
      location: 'Your Location', // Replace with actual role or dynamic user data
      content: newPostText,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setNewPostText(''); // Clear the input after posting
  };

  const handleLike = (postId) => {
    setLikedPosts((prevLikedPosts) =>
      prevLikedPosts.includes(postId)
        ? prevLikedPosts.filter((id) => id !== postId)
        : [...prevLikedPosts, postId]
    );
  };

  const handleSave = (postId) => {
    setSavedPosts((prevSavedPosts) =>
      prevSavedPosts.includes(postId)
        ? prevSavedPosts.filter((id) => id !== postId)
        : [...prevSavedPosts, postId]
    );
  };

  const handleReply = (postId) => {
    setReplyingTo(replyingTo === postId ? null : postId);
  };

  const handleCommentPost = (postId) => {
    if (commentText.trim() === '') {
      return; // Prevent posting empty content
    }
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: post.comments.length + 1,
              user: 'Your Name', // Replace with actual user name or dynamic user data
              text: commentText,
            },
          ],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    setCommentText('');
    setReplyingTo(null);
  };

  const handleKeyPress = (event, postId) => {
    if (event.key === 'Enter') {
      handleCommentPost(postId);
    }
  };

  const handleCameraClick = () => {
    setShowCameraModal(true);
  };

  const closeCameraModal = () => {
    setShowCameraModal(false);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  };

  useEffect(() => {
    if (showCameraModal) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("Error accessing the camera: ", err);
        });
    }
  }, [showCameraModal]);

  return (
    <div className="bellytalk-container" style={{
      position: 'relative',
      zIndex: 0,
    }}>
      <div className="background-image" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("/img/appointmentBG.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
        zIndex: -1, // Ensure the background is behind all other content
      }} />
      <aside className="bellytalk-sidebar">
        <nav className="bellytalk-nav">
        <Link to="/app" className="back-button-bellytalk"><IoChevronBackCircle /></Link>
          <ul>
            <li>
              <button className="bellytalk-nav-button">
                <IoPeople className="bellytalk-icon" /> People
              </button>
            </li>
            <li>
              <button className="bellytalk-nav-button">
                <IoDocumentText className="bellytalk-icon" /> Posts
              </button>
            </li>
            <li>
              <button className="bellytalk-nav-button">
                <IoMail className="bellytalk-icon" /> Inbox
              </button>
            </li>
            <hr className="bellytalk-divider" />
            <li>
              <button className="bellytalk-nav-button">
                <IoBookmark className="bellytalk-icon" /> Saved Post
              </button>
            </li>
            <li>
              <button className="bellytalk-nav-button">
                <IoHeart className="bellytalk-icon" /> Liked Post
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="bellytalk-main-content">
        <div className="bellytalk-top-bar">
          <input type="text" className="bellytalk-search-icon" placeholder="Search for people, insights and more..." />
        </div>

        <div className="bellytalk-share-box">
          <input
            type="text"
            placeholder="What's on your mind?"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="bellytalk-share-box-input"
          />
          <div className="bellytalk-icons">
            <label htmlFor="file-upload" className="bellytalk-icon">
              <IoAttach />
            </label>
            <input id="file-upload" type="file" style={{ display: 'none' }} />
            <IoCamera className="bellytalk-icon" onClick={handleCameraClick} />
            <button className="bellytalk-post-button" onClick={handlePost}>Post</button>
          </div>
        </div>

      <div className="bellytalk-filter-container">
        <button className="bellytalk-filter-button">  <IoRoseSharp  className="filter-icon" />Pregnancy Updates</button>
        <button className="bellytalk-filter-button">  <IoRoseSharp  className="filter-icon" />Baby Care Tips</button>
        <button className="bellytalk-filter-button"> <IoRoseSharp  className="filter-icon" /> Health & Wellness</button>
      </div>

        <section className="bellytalk-feed">
          {posts.map((post) => (
            <div className="bellytalk-feed-item" key={post.id}>
              <img src="img/LOGO.png" alt="Avatar" className="bellytalk-avatar-overlay" />
              <div className="bellytalk-post-content">
                <h4>{post.user}</h4>
                <div className="location-with-icon">
                  <IoLocationSharp />
                  <p>{post.location}</p>
                </div>
                <p>{post.content}</p>
                <hr className="bellytalk-divider" />
                <div className="bellytalk-actions">
                  <button className="bellytalk-action-button" onClick={() => handleReply(post.id)}>Reply</button>
                  <IoHeart
                    className={`bellytalk-action-icon ${likedPosts.includes(post.id) ? 'active' : ''}`}
                    onClick={() => handleLike(post.id)}
                  />
                  <IoBookmark
                    className={`bellytalk-action-icon ${savedPosts.includes(post.id) ? 'active' : ''}`}
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
        {post.comments.map((comment) => (
  <div className="bellytalk-comment" key={comment.id}>
    <div className="comment-user-info">
      <img src="img/LOGO.png" alt="User Avatar" className="comment-avatar" />
      <div>
        <h4>{comment.user}</h4>
        <p>{comment.text}</p>
      </div>
    </div>
  </div>
))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <aside className="bellytalk-right-sidebar">
      <div className="bellytalk-featured">
      <div className="featured-image">
    <img src="/img/bg5.jpg" alt="Featured Story" />
  </div>
    <div className="featured-description">
      <h4>Featured Story</h4>
      <p>A Mother's Full-Time Story</p>
      <p>Short description of the story goes here...</p>
    </div>
  </div>

  <div className="bellytalk-people-you-may-know">
  <h4>People You May Know</h4>
  <hr className="divider" />
  <ul className="people-you-may-know-list">
    <li className="people-you-may-know-item">
      <img src="img/LOGO.png" alt="Avatar" className="people-you-may-know-avatar" />
      <div className="people-you-may-know-details">
        <p className="name">Jon Pearl</p>
        <p className="location">Sampaloc, Manila</p>
      </div>
      <button className="message-icon">
        <IoNavigateOutline   className="icon" />
      </button>
    </li>
    <li className="people-you-may-know-item">
      <img src="img/LOGO.png" alt="Avatar" className="people-you-may-know-avatar" />
      <div className="people-you-may-know-details">
        <p className="name">Christie Pizzo</p>
        <p className="location">San Jose, Bulacan</p>
      </div>
      <button className="message-icon">
        <IoNavigateOutline IoNavigateOutline  className="icon" />
      </button>
    </li>
    <li className="people-you-may-know-item">
      <img src="img/LOGO.png" alt="Avatar" className="people-you-may-know-avatar" />
      <div className="people-you-may-know-details">
        <p className="name">Alex Laprade</p>
        <p className="location">Sampaloc, Manila</p>
      </div>
      <button className="message-icon">
        <IoNavigateOutline  className="icon" />
      </button>
    </li>
    <li className="people-you-may-know-item">
      <img src="img/LOGO.png" alt="Avatar" className="people-you-may-know-avatar" />
      <div className="people-you-may-know-details">
        <p className="name">Hannah Cochran</p>
        <p className="location">San Jose, Bulacan</p>
      </div>
      <button className="message-icon">
        <IoNavigateOutline  className="icon" />
      </button>
    </li>
    <li className="people-you-may-know-item">
      <img src="img/LOGO.png" alt="Avatar" className="people-you-may-know-avatar" />
      <div className="people-you-may-know-details">
        <p className="name">Oren Shatken</p>
        <p className="location">San Jose, Bulacan</p>
      </div>
      <button className="message-icon">
        <IoNavigateOutline  className="icon" />
      </button>
    </li>
  </ul>
</div>
      </aside>
    </div>
  );
};

export default BellyTalk;
