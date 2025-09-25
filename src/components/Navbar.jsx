// Navbar.jsx - Tesla Style
import { useState } from "react";
import { FaQuestionCircle, FaUserCircle, FaGlobe } from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full fixed top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo - Tesla Style */}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-black tracking-tight">
            <span className="text-3xl">C</span>arCare
          </div>
        </div>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center space-x-8 text-black font-medium text-sm">
          <button 
            onClick={() => scrollToSection('home')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Trang Chủ
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Dịch Vụ
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Về Chúng Tôi
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Liên Hệ
          </button>
          <button 
            onClick={() => scrollToSection('booking')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            Đặt Lịch
          </button>
        </nav>

        {/* Right Icons - Tesla Style */}
        <div className="flex items-center space-x-4">
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <FaQuestionCircle size={14} className="text-gray-700" />
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <FaGlobe size={14} className="text-gray-700" />
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
            <FaUserCircle size={14} className="text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-6 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Trang Chủ
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Dịch Vụ
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Về Chúng Tôi
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Liên Hệ
            </button>
            <button 
              onClick={() => scrollToSection('booking')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Đặt Lịch
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
