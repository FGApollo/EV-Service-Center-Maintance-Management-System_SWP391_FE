// Navbar.jsx - Tesla Style
import { useState } from "react";
import { FaQuestionCircle, FaUserCircle, FaGlobe } from "react-icons/fa";

export default function Navbar({ onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full fixed top-0 z-50 bg-black/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo - Tesla Style */}
        <div className="flex items-center cursor-pointer" onClick={() => handleNavigate('home')}>
          <div className="text-2xl font-bold text-white tracking-tight">
            <span className="text-3xl">C</span>arCare
          </div>
        </div>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center space-x-8 text-white font-medium text-sm">
          <button 
            onClick={() => scrollToSection('home')}
            className="px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition-colors duration-200"
          >
            Trang Chủ
          </button>
          <button 
            onClick={() => scrollToSection('services')}
            className="px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition-colors duration-200"
          >
            Dịch Vụ
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition-colors duration-200"
          >
            Về Chúng Tôi
          </button>
          <button 
            onClick={() => scrollToSection('branches')}
            className="px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition-colors duration-200"
          >
            Chi Nhánh
          </button>
          <button 
            onClick={() => handleNavigate('booking')}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded hover:from-blue-600 hover:to-emerald-600 transition-all duration-200 font-semibold"
          >
            Đặt Lịch Hẹn
          </button>
        </nav>

        {/* Right Icons - Tesla Style */}
        <div className="flex items-center space-x-4">
          <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors duration-200">
            <FaQuestionCircle size={14} className="text-white" />
          </button>
          <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors duration-200">
            <FaGlobe size={14} className="text-white" />
          </button>
          <button 
            onClick={() => handleNavigate('login')}
            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
          >
            <FaUserCircle size={14} className="text-white" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-white"
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
              onClick={() => scrollToSection('branches')}
              className="block w-full text-left text-black font-medium hover:text-gray-600 transition-colors"
            >
              Chi Nhánh
            </button>
            <button 
              onClick={() => handleNavigate('booking')}
              className="block w-full text-left bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold p-3 rounded hover:from-blue-600 hover:to-emerald-600 transition-all"
            >
              Đặt Lịch Hẹn
            </button>
            <button 
              onClick={() => handleNavigate('login')}
              className="block w-full text-left text-blue-600 font-medium hover:text-blue-800 transition-colors border-t pt-4"
            >
              Đăng Nhập
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
