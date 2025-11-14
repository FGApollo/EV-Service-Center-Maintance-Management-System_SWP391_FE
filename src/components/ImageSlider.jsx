import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "EMPOWER YOUR DRIVE",
      subtitle: "Premium EV Service Center",
      description: "Step into the future with a car that blends elegant features, sleek design, and everything you need for the road ahead",
      cta1: "Explore",
      cta2: "Book Service"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "ELECTRIC REVOLUTION",
      subtitle: "Advanced Technology",
      description: "Experience the pinnacle of electric vehicle performance and innovation",
      cta1: "Discover More",
      cta2: "Schedule Now"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "LUXURY REDEFINED",
      subtitle: "Premium Service Excellence",
      description: "Where cutting-edge technology meets unparalleled craftsmanship",
      cta1: "Learn More",
      cta2: "Contact Us"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "PERFORMANCE UNLEASHED",
      subtitle: "Next-Gen Electric Power",
      description: "Elevate your driving experience with precision engineering and dynamic performance",
      cta1: "Explore",
      cta2: "Book Now"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      title: "FUTURE IS NOW",
      subtitle: "Sustainable Excellence",
      description: "Join the electric revolution with world-class service and maintenance",
      cta1: "Get Started",
      cta2: "Learn More"
    }
  ];

  // Auto play slides - Longer interval for smooth Ken Burns effect
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 seconds to match Ken Burns animation

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