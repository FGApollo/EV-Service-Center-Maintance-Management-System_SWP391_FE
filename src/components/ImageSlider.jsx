import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Xe Điện Model S",
      subtitle: "Khuyến mãi đặc biệt",
      description: "Giảm $7,500 với Federal Tax Credit",
      cta1: "Đặt Lịch Hẹn",
      cta2: "Liên Hệ Ngay"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Xe Điện Model Y",
      subtitle: "SUV điện cao cấp",
      description: "Hiệu suất vượt trội, thiết kế tinh tế",
      cta1: "Đặt Lịch Hẹn",
      cta2: "Liên Hệ Ngay"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Dịch Vụ Bảo Dưỡng",
      subtitle: "Chăm sóc xe điện chuyên nghiệp",
      description: "Đội ngũ kỹ thuật viên được đào tạo chuyên sâu",
      cta1: "Đặt Lịch Hẹn",
      cta2: "Liên Hệ Ngay"
    }
  ];

  // Auto play slides
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="image-slider"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Background Images */}
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.image})`
            }}
          >
            <div className="slide-content">
              <div className="content-wrapper">
                <h1 className="slide-title">{slide.title}</h1>
                <h2 className="slide-subtitle">{slide.subtitle}</h2>
                <p className="slide-description">{slide.description}</p>
                
                <div className="slide-actions">
                  <button className="btn-primary-slide">{slide.cta1}</button>
                  <button className="btn-secondary-slide">{slide.cta2}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="nav-arrow nav-prev" onClick={prevSlide}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button className="nav-arrow nav-next" onClick={nextSlide}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="dots-container">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default ImageSlider;