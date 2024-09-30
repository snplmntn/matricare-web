import React, { useState } from 'react';
import '../../styles/features/bellytalk.css';
import { IoSearch, IoBookmark, IoHeart, IoLocationSharp, IoPencil, IoArrowBack, IoCloudUploadOutline} from 'react-icons/io5';

const BellyTalk = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Karyll Cruz',
      location: 'San Jose, Bulacan',
      content: "👶 From the first flutter of kicks to the first giggles, being a mom means experiencing a love so deep it's beyond words. Cherishing these tiny milestones that fill my heart with endless joy.",
      comments: [],
      image: null,
    },
    {
      id: 2,
      user: 'Theresa Neilson',
      location: 'Sampaloc, Manila',
      content: 'Embracing the chaos and cuddles, because thats what makes motherhood magical. From messy mornings to bedtime stories, every moment with my little ones is a precious memory in the making. 💕',
      comments: [],
      image: null,
    },
  ]);
  const [newPostText, setNewPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); 
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);


  const openModal = () => {
    setIsModalOpen(true);
    setNewPostText(''); 
    setStep(1); 
    setSelectedImage(null); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewPostText('');
    setStep(1);
    setSelectedImage(null); 
  };

  const handleNextStep = () => {
    setStep(2); 
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category); 
      } else {
        return [...prev, category]; 
      }
    });
  };


  const handlePostSubmit = () => {
    if (newPostText.trim() === '') {
      alert('Post content cannot be empty.'); 
      return;
    }
  
    if (selectedCategories.length === 0) {
      alert('Please select at least one category.');
      return;
    }
  
    const newPost = {
      id: posts.length + 1, 
      user: 'Your Name', 
      location: 'Your Location', 
      content: newPostText,
      categories: selectedCategories,
      comments: [], 
      image: selectedImage, // Include the selected image here
    };
  
    setPosts([newPost, ...posts]); 
    setNewPostText(''); 
    setSelectedImage(null);
    setSuccessMessage('Post Submitted');
    setIsModalOpen(false); 
    setSelectedCategories([]); 
  };
  

  const handlePost = () => {
    if (newPostText.trim() === '') {
      return; 
    }
    const newPost = {
      id: posts.length + 1, 
      user: 'Your Name', 
      location: 'Your Location', 
      content: newPostText,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setNewPostText(''); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
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

  const filterPosts = (filterType) => {
    // Logic to filter posts based on the filterType
    console.log(`Filtering posts by: ${filterType}`);
};

  return (
    <div className="bellytalk-container">
       <div className="bellytalk-top-bar">
          <div className="bellytalk-title-logo">BellyTalk</div>
          <div className="bellytalk-icons">
            <button className="bellytalk-icon-button">
              <IoBookmark className="bellytalk-icon" />
              <span className="bellytalk-label">Saved</span>
            </button>
            <button className="bellytalk-icon-button">
              <IoHeart className="bellytalk-icon" />
              <span className="bellytalk-label">Favorites</span>
            </button>
          </div>

          <div className="bellytalk-search-container">
            <IoSearch className="bellytalk-search-icon" />
            <input 
              type="text" 
              className="bellytalk-search" 
              placeholder="Search for people, insights and more..." 
            />
          </div>
        </div>

      <main className="bellytalk-main-content">
      <section class="trending-section">
        <h2>Trending Now</h2>
        <div class="trending-articles">
          <article class="trending-article">
              <div class="article-image">
                  <img src="img/topic1.jpg" alt="Article Headline 1" />
                  <div class="headlines">
                      <h3>Maternal Health Disparities</h3>
                      <p>Posted by: Bea Benella Rosal</p>
                  </div>
              </div>
          </article>
          <article class="trending-article">
              <div class="article-image">
                  <img src="img/topic2.jpg" alt="Article Headline 2" />
                  <div class="headlines">
                      <h3>Home Births and Midwifery</h3>
                      <p>Posted by: Bea Benella Rosal</p>
                  </div>
              </div>
          </article>
          <article class="trending-article">
              <div class="article-image">
                  <img src="img/topic3.jpg" alt="Article Headline 3" />
                  <div class="headlines">
                      <h3>Celebrity Pregnancy Announcements</h3>
                      <p>Posted by: Bea Benella Rosal</p>
                  </div>
              </div>
          </article>
          <article class="trending-article">
              <div class="article-image">
                  <img src="img/topic4.jpg" alt="Article Headline 4" />
                  <div class="headlines">
                      <h3>Rihanna Reveals Due Date for Her Second Baby During a Concert</h3>
                      <p>Posted by: Bea Benella Rosal</p>
                  </div>
              </div>
          </article>
      </div>
    </section>

    <div className="content-container">
      <div className='sharebox'>
        <div className="sharebox-container" onClick={openModal}>
          <IoPencil className="pen-icon" />
          <input
            type="text"
            placeholder="What's your experience?"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="bellytalk-share-box-input"
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="sharebox-modal-overlay">
          <div className="sharebox-modal-content">
            <span onClick={closeModal} className="sharebox-back-button">
              <IoArrowBack />
            </span>

            {step === 1 && (
          <>
            <h2 className="sharebox-title">Create a New Talk</h2>
            <textarea
              placeholder="What's your experience?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="sharebox-textarea"
            />
            <div className="upload-button">
              <label htmlFor="file-upload" className="custom-file-upload">
                <IoCloudUploadOutline />
                Upload Photo
              </label>
              <input 
                id="file-upload" 
                type="file" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} // Hide the default file input
              />
            </div>
            {selectedImage && (
              <div className="image-preview">
                <img src={selectedImage} alt="Selected" className="preview-image" />
              </div>
            )}
            <button onClick={handleNextStep} className="sharebox-button">Next</button>
          </>
        )}

              {step === 2 && (
                <>
                  <h2 className="sharebox-title">Select Categories</h2>
                  <div className="category-options">
                    {['First Time Moms', 'Breast Feeding', 'Maternity Style', 'Labor', 'Baby Essential'].map((category) => (
                      <div 
                        key={category} 
                        className={`category-option ${selectedCategories.includes(category) ? 'selected' : ''}`}
                        onClick={() => handleCategoryClick(category)} // Handle click to select/deselect
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                  <button onClick={handlePostSubmit} className="sharebox-button">Post</button>
                  {successMessage && <p className="success-message">{successMessage}</p>}
                </>
              )}
          </div>
        </div>
      )}
    </div>

        <section className="bellytalk-feed">
          {posts.map((post) => (
            <div className="bellytalk-feed-item" key={post.id}>
              <img src="img/topic1.jpg" alt="Avatar" className="bellytalk-avatar-overlay" />
              <div className="bellytalk-post-content">
                <h4>{post.user}</h4>
                <div className="location-with-icon">
                  <IoLocationSharp />
                  <p>{post.location}</p>
                </div>
                <p>{post.content}</p>
                {post.image && (
                <img src={post.image} alt="Post" className="post-image" />
              )}
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
        <div className="filter-section">
          <h3>Filters</h3>
          <div className="filter-container">
            <input type="checkbox" id="all" onChange={() => filterPosts('All')} />
            <label for="all">All</label>

            <input type="checkbox" id="first-time" onChange={() => filterPosts('first-time')} />
            <label for="first-time">First-Time Moms</label>

            <input type="checkbox" id="baby-essentials" onChange={() => filterPosts('baby-essentials')} />
            <label for="baby-essentials">Baby Essentials</label>

            <input type="checkbox" id="maternity-style" onChange={() => filterPosts('maternity-style')} />
            <label for="maternity-style">Maternity Style</label>

            <input type="checkbox" id="breast-feeding" onChange={() => filterPosts('breast-feeding')} />
            <label for="breast-feeding">Breast Feeding</label>

            <input type="checkbox" id="gender-reveal" onChange={() => filterPosts('gender-reveal')} />
            <label for="gender-reveal">Gender Reveal</label>

            <input type="checkbox" id="parenting-tips" onChange={() => filterPosts('parenting-tips')} />
            <label for="parenting-tips">Parenting Tips</label>
          </div>

        </div>
      </main>
    </div>
  );
};

export default BellyTalk;