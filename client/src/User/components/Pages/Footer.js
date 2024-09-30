import React from 'react';
import "../../styles/pages/footer.css"; 

const Footer = () => {
    return (
        <footer className="footer-container">
            <img className="footer-logo" src="img/logo3.png" alt="Logo" />
            <div className="footer-menu">
                <ul className="menu-items">
                    <li>Home</li>
                    <li>About</li>
                    <li>Service</li>
                    <li>Articles</li>
                    <li>Contact</li>
                </ul>
            </div>
            <hr className="footer-line" />
            <div className="copyright">
                <p>&copy; 2024 MatriCare All rights reserved</p>
            </div>
        </footer>
    );
}

export default Footer;
