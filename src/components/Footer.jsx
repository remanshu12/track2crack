import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Brand Info */}
          <div>
            <h2 className="text-xl font-bold mb-2">Track2Crack</h2>
            <p className="text-gray-300 text-sm">Your pathway to academic success</p>
          </div>


          {/* Quick Links */}
          <div className="flex justify-around">
            <div>
              <h3 className="font-semibold mb-2">Links</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>
                  <Link 
                    to="/" 
                    onClick={() => scrollToSection('home')}
                    className="hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/" 
                    onClick={() => scrollToSection('courses')}
                    className="hover:text-white"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/" 
                    onClick={() => scrollToSection('about')}
                    className="hover:text-white"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resources</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>
                  <Link 
                    to="/" 
                    onClick={() => scrollToSection('guide')}
                    className="hover:text-white"
                  >
                    Study Guide
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/" 
                    onClick={() => scrollToSection('faq')}
                    className="hover:text-white"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/" 
                    onClick={() => scrollToSection('contact')}
                    className="hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-end">
            <div className="flex space-x-4 mb-3">
              <a href="#" className="text-gray-300 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaGithub />
              </a>
            </div>
            <p className="text-gray-300 text-sm">contact@track2crack.com</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          <p>© 2025 Track2Crack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;