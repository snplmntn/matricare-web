import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header1() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center px-2 md:px-8 bg-white shadow h-20 w-full z-50 relative">
      {/* Logo */}
      <img
        src="img/logo3.png"
        alt="Logo"
        className="max-w-[50px] h-[50px] rounded-full ml-0 md:ml-48 z-10"
      />
      {/* Brand Name */}
      <div className="hidden md:block text-2xl text-[#7c459c] font-extrabold ml-2 z-10">
        MATRICARE
      </div>
      {/* Desktop Nav */}
      <nav className="flex-1 justify-center hidden md:flex">
        <ul className="flex items-center space-x-8 ml-0">
          <li>
            <Link
              to="/"
              className="font-serif text-md text-[#7c459c] hover:text-[#E39FA9]"
            >
              Home
            </Link>
          </li>
          <li>
            <a
              href="#about-us"
              className="font-serif text-md text-[#7c459c] hover:text-[#E39FA9]"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#what-we-do"
              className="font-serif text-md text-[#7c459c] hover:text-[#E39FA9]"
            >
              Service
            </a>
          </li>
          <li>
            <a
              href="#topic-of-interest"
              className="font-serif text-md text-[#7c459c] hover:text-[#E39FA9]"
            >
              Articles
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="font-serif text-md text-[#7c459c] hover:text-[#E39FA9]"
            >
              Contact
            </a>
          </li>
          <li>
            <Link
              to="/belly-talk"
              className="font-serif text-md text-[#7c459c] hover:text-[#E39FA9]"
            >
              BellyTalk
            </Link>
          </li>
        </ul>
      </nav>
      {/* Desktop Login */}
      <div className="hidden md:flex ml-auto">
        <Link
          to="/login"
          className="bg-[#E39FA9] text-white px-20 py-2 rounded-full text-lg  hover:bg-[#7c459c] transition text-center mr-36"
        >
          LOGIN
        </Link>
      </div>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden ml-auto z-20"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <HiX className="text-3xl text-[#7c459c]" />
        ) : (
          <HiMenu className="text-3xl text-[#7c459c]" />
        )}
      </button>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center gap-8 z-40 transition-all">
          <ul className="flex flex-col items-center gap-6">
            <li>
              <Link
                to="/"
                className="font-serif text-2xl text-[#7c459c] hover:text-[#E39FA9]"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#about-us"
                className="font-serif text-2xl text-[#7c459c] hover:text-[#E39FA9]"
                onClick={() => setMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#what-we-do"
                className="font-serif text-2xl text-[#7c459c] hover:text-[#E39FA9]"
                onClick={() => setMenuOpen(false)}
              >
                Service
              </a>
            </li>
            <li>
              <a
                href="#topic-of-interest"
                className="font-serif text-2xl text-[#7c459c] hover:text-[#E39FA9]"
                onClick={() => setMenuOpen(false)}
              >
                Articles
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="font-serif text-2xl text-[#7c459c] hover:text-[#E39FA9]"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </li>
            <li>
              <Link
                to="/belly-talk"
                className="font-serif text-2xl text-[#7c459c] hover:text-[#E39FA9]"
                onClick={() => setMenuOpen(false)}
              >
                BellyTalk
              </Link>
            </li>
          </ul>
          <Link
            to="/login"
            className="bg-[#E39FA9] text-white px-10 py-3 rounded-full text-lg font-semibold hover:bg-[#7c459c] transition text-center"
            onClick={() => setMenuOpen(false)}
          >
            LOGIN
          </Link>
        </div>
      )}
    </header>
  );
}
