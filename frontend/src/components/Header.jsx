import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.svg';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white dark:bg-[#1a202c] border-b border-[#e7ebf3] dark:border-gray-800 sticky top-0 z-50">
      <div className="px-4 md:px-8 lg:px-40 flex justify-center">
        <header className="flex w-full max-w-[1280px] items-center justify-between py-4">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="WakiliSmart" className="h-10 w-auto" />
            <h2 className="text-navy-deep dark:text-white text-xl font-bold font-serif tracking-tight">WakiliSmart</h2>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {['Home', 'About', 'Practice Areas', 'Knowledge Hub'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                className="text-navy-deep dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/staff-login" className="hidden sm:block text-sm font-medium text-primary hover:text-blue-700">
            Staff Portal
            </Link>
            <Link 
              to="/book-consultation" 
              className="flex items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-700 transition-colors text-white text-sm font-bold shadow-sm cursor-pointer"
            >
              <span>Book Consultation</span>
            </Link>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-navy-deep dark:text-white cursor-pointer"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </header>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#1a202c] border-t border-gray-100 dark:border-gray-800 p-4 absolute w-full shadow-lg">
           <nav className="flex flex-col gap-4">
             <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-navy-deep dark:text-white font-medium">Home</Link>
             <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-navy-deep dark:text-white font-medium">About</Link>
             <Link to="/book-consultation" onClick={() => setIsMenuOpen(false)} className="text-primary font-bold">Book Consultation</Link>
           </nav>
        </div>
      )}
    </div>
  );
}