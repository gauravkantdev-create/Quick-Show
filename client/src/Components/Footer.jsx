import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full bg-black py-8 sm:py-10 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8'>
      <div className='w-full max-w-7xl mx-auto'>
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-6 sm:mb-8 md:mb-10">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link 
              to="/" 
              onClick={scrollToTop} 
              className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6"
            >
              <img 
                src="/favicon.svg" 
                alt="Quick Show Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10" 
              />
              <span className="text-white text-lg sm:text-xl md:text-2xl font-bold">Quick Show</span>
            </Link>
            <div className='w-32 sm:w-40 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent my-2 sm:my-3 md:my-4'></div>
            <p className='text-xs sm:text-sm text-white/60 leading-relaxed'>
              Your ultimate destination for movies, trailers, and showtimes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className='text-sm sm:text-base text-white font-semibold mb-3 sm:mb-4'>Quick Links</h3>
            <div className="flex flex-col space-y-1.5 sm:space-y-2">
              <Link 
                to="/" 
                onClick={scrollToTop} 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                onClick={scrollToTop} 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                Movies
              </Link>
              <Link 
                to="/favourite" 
                onClick={scrollToTop} 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                Favorites
              </Link>
              <Link 
                to="/theaters" 
                onClick={scrollToTop} 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                Theaters
              </Link>
              <Link 
                to="/releases" 
                onClick={scrollToTop} 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                New Releases
              </Link>
            </div>
          </div>

          {/* Information */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className='text-sm sm:text-base text-white font-semibold mb-3 sm:mb-4'>Information</h3>
            <div className="flex flex-col space-y-1.5 sm:space-y-2">
              <Link 
                to="/about" 
                onClick={scrollToTop} 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                onClick={scrollToTop} 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                Contact Us
              </Link>
              <Link 
                to="/faq" 
                onClick={scrollToTop} 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                FAQ
              </Link>
              <Link 
                to="/privacy" 
                onClick={scrollToTop} 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="col-span-2 sm:col-span-1 flex flex-col items-center sm:items-start">
            <h3 className='text-sm sm:text-base text-white font-semibold mb-3 sm:mb-4'>Connect With Us</h3>
            <div className="flex gap-4 sm:flex-col sm:space-y-2">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                Twitter
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                Instagram
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                YouTube
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className='text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-200'
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 sm:my-8'></div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-2 sm:pt-3 md:pt-4">
          <p className='text-xs text-white/50'>
            © {currentYear} Quick Show. All rights reserved.
          </p>
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center">
            <Link 
              to="/terms" 
              className='text-xs text-white/60 hover:text-white transition-colors duration-200'
            >
              Terms & Conditions
            </Link>
            <div className='w-px h-3 sm:h-4 bg-white/20'></div>
            <Link 
              to="/privacy" 
              className='text-xs text-white/60 hover:text-white transition-colors duration-200'
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;