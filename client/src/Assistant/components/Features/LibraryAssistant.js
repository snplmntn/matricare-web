import React, { useState, useEffect } from 'react';
import '../../style/features/libraryassistant.css'; 
import { Link } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';

const initialBooks = [
  { id: 1, title: 'Stages of Pregnancy', author: 'Bea Benella Rosal', cover: '/img/topic1.jpg', category: 'First Time Moms', approved: true  },
  { id: 2, title: 'Maternity Style', author: 'Bea Benella Rosal', cover: '/img/topic2.jpg', category: 'Fashion', approved: true  },
  { id: 3, title: 'Pregnancy Fitness', author: 'Bea Benella Rosal', cover: '/img/topic3.jpg', category: 'Health', approved: true  },
  { id: 4, title: 'Preparing for Baby', author: 'Bea Benella Rosal', cover: '/img/topic4.jpg', category: 'First Time Moms', approved: true  },
  { id: 5, title: 'Pregnancy Safety', author: 'Bea Benella Rosal', cover: '/img/topic5.jpg', category: 'Health', approved: true  },
  { id: 6, title: 'Pregnancy Symptoms', author: 'Bea Benella Rosal', cover: '/img/labor1.jpg', category: 'Health', approved: true  },
  { id: 7, title: 'Labor and Delivery Options', author: 'Bea Benella Rosal', cover: '/img/bg6.jpg', category: 'Labor', approved: true  },
  { id: 8, title: 'Baby’s First Days at Home', author: 'Bea Benella Rosal', cover: '/img/pic1.jpg', category: 'First Time Moms', approved: true  },
  { id: 9, title: 'Financial Planning for New Parents', author: 'Bea Benella Rosal', cover: '/img/bg5.jpg', category: 'Finance', approved: true  },
  { id: 10, title: 'Preparing for Breastfeeding', author: 'Bea Benella Rosal', cover: '/img/article1.webp', category: 'Health', approved: true  },
  { id: 11, title: 'Labor Preparation Techniques', author: 'Bea Benella Rosal', cover: '/img/bg2.webp', category: 'Labor', approved: true  },
  { id: 12, title: 'Baby’s First Days at Home', author: 'Bea Benella Rosal', cover: '/img/bg1.webp', category: 'First Time Moms', approved: true  },
  { id: 13, title: 'Weekly Pregnancy', author: 'Bea Benella Rosal', cover: '/img/bg1.webp', category: 'First Time Moms', approved: true  },
];

// Map book IDs to their routes
const bookRoutes = {
  1: '/library-item1',
  2: '/library-item2',
  3: '/library-item3',
  4: '/library-item4',
  5: '/library-item5',
  6: '/library-item6',
  7: '/library-item7',
  8: '/library-item8',
  9: '/library-item9',
  10: '/library-item10',
  11: '/library-item11',
  12: '/library-item12',
  13: '/library-item13',
};

const LibraryAssistant = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showForm, setShowForm] = useState(false); 
  const [books, setBooks] = useState(initialBooks);
  const [newArticle, setNewArticle] = useState({
    title: '',
    author: '',
    category: 'Choose A Category',
    cover: null,
  });

  const filteredBooks = books.filter(book => {
    const matchesSearchTerm = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilter === 'All' || book.category === selectedFilter; // Filter by category
    return matchesSearchTerm && matchesCategory;
  });

  // Define filter options
  const filterOptions = ['All', 'First Time Moms', 'Health', 'Labor', 'Finance', 'Fashion'];

  const handleAddArticle = (e) => {
    e.preventDefault();

    // Validate the article
    if (!newArticle.title || !newArticle.author || !newArticle.cover) {
      alert('Please fill in all fields and upload a Book Cover.');
      return;
    }

    const newBook = {
      id: books.length + 1,
      title: newArticle.title,
      author: newArticle.author,
      category: newArticle.category,
      cover: URL.createObjectURL(newArticle.cover),
      approved: false,
    };

    setBooks((prevBooks) => {
      const updatedBooks = [...prevBooks, newBook];
      return updatedBooks;
    });

    setNewArticle({ title: '', author: '', category: 'Choose A Category', cover: null });
    setShowForm(false);
  };

  const handleApproveArticle = (id) => {
    // Approve the article by updating its approved status
    setBooks((prevBooks) => prevBooks.map(book => 
      book.id === id ? { ...book, approved: true } : book
    ));
  };

  return (
    <div className="LA-library-layout">
      <div className="LA-main-content">
        <header className="LA-library-header">
          <div className="LA-library-title">MatriCare.</div>
          <div className="LA-header-actions">
          <button className="LA-add-article-button" onClick={() => setShowForm(!showForm)}>+ Add Articles</button>
          <div className="LA-search-container">
            <input
              type="text"
              className="search-bar-library"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearch className="LA-search-icon" />
          </div>
            <select 
              className="LA-filter-dropdown" 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)} // Update filter on selection
            >
              {filterOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </header>

        {showForm && (
          <div className="modal-overlay">
            <div className="newarticle-modal">
              <button className="newarticle-close-button" onClick={() => setShowForm(false)}>×</button>
              <h3>New Article</h3>
              <hr className="add-hr" />
              <div className="LA-article-form">
                <form onSubmit={handleAddArticle} className="LA-add-article-form">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewArticle({ ...newArticle, cover: e.target.files[0] })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    required
                  />
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  >
                    <option value="Choose A Category">Choose A Category</option>
                    <option value="First Time Moms">First Time Moms</option>
                    <option value="Health">Health</option>
                    <option value="Labor">Labor</option>
                    <option value="Finance">Finance</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                  <button type="submit">Add Article</button>
                </form>
              </div>
            </div>
          </div>
        )}


        <section id="library" className="LA-library-section">
          <h2>Library</h2>
          <div className="LA-book-list-container">
            {filteredBooks.map((book) => (
              <Link to={bookRoutes[book.id]} key={book.id} className="LA-library-item">
                <div className="LA-book-cover-container">
                  <img src={book.cover} alt={book.title} className="LA-book-cover" />
                  {/* Show overlay for unapproved books */}
                  {!book.approved && (
                    <div className="LA-overlay">
                      <span className="LA-overlay-text">Waiting for Approval</span>
                    </div>
                  )}
                </div>
                <div className="LA-book-details">
                  <h3 className="LA-book-title">{book.title}</h3>
                  <p className="LA-book-author">Author: {book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LibraryAssistant;
