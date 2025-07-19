import { Link, NavLink } from "react-router-dom";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  useEffect(() => {
    // Smooth scroll handling for anchor links
    const handleAnchorClick = (e) => {
      const targetId = e.currentTarget.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for header height
            behavior: 'smooth'
          });
          // Update URL without reload
          window.history.pushState(null, '', `${location.pathname}${targetId}`);
        }
      }
    };

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });

    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
    };
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0d135c] to-[#bfc9e8] shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center space-x-12">
        <Link 
          to="/" 
          className="text-2xl font-extrabold text-white tracking-wide hover:text-indigo-200 transition-colors duration-200"
        >
          Track2Crack
        </Link>
        <ul className="hidden md:flex space-x-8 font-medium text-white">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `hover:text-indigo-200 transition-colors duration-200 ${
                  isActive ? "text-indigo-200 font-bold" : ""
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <a 
              href="#features" 
              className="hover:text-indigo-200 transition-colors duration-200"
            >
              Features
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className="hover:text-indigo-200 transition-colors duration-200"
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className="hover:text-indigo-200 transition-colors duration-200"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="inline-block rounded-sm border border-current px-8 py-3 text-sb font-bold bg-white text-indigo-900 hover:bg-indigo-50 transition-colors duration-200"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="inline-block rounded-sm bg-indigo-600 px-8 py-3 text-sb font-bold text-white hover:bg-indigo-700 transition-colors duration-200"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;