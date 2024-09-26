import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/pages/header1.css"; 

export default function Header1() {
  return (
    <header className="header1">
      <img src="img/logo3.png" alt="Logo" className="logo-header" />
      <div className="header-left1">MATRICARE</div>
      <nav className="header-nav">
        <ul className="nav-links1">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><a href="#about-us" className="nav-link">About</a></li>
          <li><a href="#what-we-do" className="nav-link">Service</a></li>
          <li><a href="#topic-of-interest" className="nav-link">Articles</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
          <Link to="/belly-talk" className="nav-link">BellyTalk</Link>
        </ul>
      </nav>
      <div className="header-right1">
        <Link to="/login" className="login-button">LOGIN</Link>
      </div>
    </header>
  );
}
