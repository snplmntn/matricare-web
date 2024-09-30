import React, { useState, useEffect } from 'react';
import '../../style/features/libraryassistant.css'; 
import { Link } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';



const books = [
  { id: 1, title: 'Stages of Pregnancy', author: 'Bea Benella Rosal', cover: '/img/topic1.jpg', category: 'First Time Moms' },
  { id: 2, title: 'Maternity Style', author: 'Bea Benella Rosal', cover: '/img/topic2.jpg', category: 'Fashion' },
  { id: 3, title: 'Pregnancy Fitness', author: 'Bea Benella Rosal', cover: '/img/topic3.jpg', category: 'Health' },
  { id: 4, title: 'Preparing for Baby', author: 'Bea Benella Rosal', cover: '/img/topic4.jpg', category: 'First Time Moms' },
  { id: 5, title: 'Pregnancy Safety', author: 'Bea Benella Rosal', cover: '/img/topic5.jpg', category: 'Health' },
  { id: 6, title: 'Pregnancy Symptoms', author: 'Bea Benella Rosal', cover: '/img/labor1.jpg', category: 'Health' },
  { id: 7, title: 'Labor and Delivery Options', author: 'Bea Benella Rosal', cover: '/img/bg6.jpg', category: 'Labor' },
  { id: 8, title: 'Baby’s First Days at Home', author: 'Bea Benella Rosal', cover: '/img/pic1.jpg', category: 'First Time Moms' },
  { id: 9, title: 'Financial Planning for New Parents', author: 'Bea Benella Rosal', cover: '/img/bg5.jpg', category: 'Finance' },
  { id: 10, title: 'Preparing for Breastfeeding', author: 'Bea Benella Rosal', cover: '/img/article1.webp', category: 'Health' },
  { id: 11, title: 'Labor Preparation Techniques', author: 'Bea Benella Rosal', cover: '/img/bg2.webp', category: 'Labor' },
  { id: 12, title: 'Baby’s First Days at Home', author: 'Bea Benella Rosal', cover: '/img/bg1.webp', category: 'First Time Moms' },
  { id: 13, title: 'Weekly Pregnancy', author: 'Bea Benella Rosal', cover: '/img/bg1.webp', category: 'First Time Moms' },
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
  const [selectedFilter, setSelectedFilter] = useState('All'); // State for selected filter

  const filteredBooks = books.filter(book => {
    const matchesSearchTerm = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedFilter === 'All' || book.category === selectedFilter; // Filter by category
    return matchesSearchTerm && matchesCategory;
  });

  // Define filter options
  const filterOptions = ['All', 'First Time Moms', 'Health', 'Labor', 'Finance', 'Fashion'];

  return (
    <div className="library-layout">
      <div className="main-content">
        <header className="library-header">
          <div className="library-title">MatriCare.</div>
          <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              className="search-bar-library"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearch className="search-icon" />
          </div>
            <select 
              className="filter-dropdown" 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value)} // Update filter on selection
            >
              {filterOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </header>

        <section id="library" className="library-section">
          <h2>Library</h2>
          <div className="book-list-container">
            {filteredBooks.map((book) => (
              <Link to={bookRoutes[book.id]} key={book.id} className="library-item">
                <img src={book.cover} alt={book.title} className="book-cover" />
                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">Author: {book.author}</p>
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
