import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CarouselItem {
  icon: string;
  title: string;
  description: string;
  imgSrc: string;
  link?: string; // Add optional link property
}

interface AutoCarousel3DProps {
  items: CarouselItem[];
  onActiveIndexChange?: (index: number) => void; // Add callback for active index changes
}

const AutoCarousel3D: React.FC<AutoCarousel3DProps> = ({ items, onActiveIndexChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Auto-rotation effect
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => {
        const newIndex = (prev + 1) % items.length;
        onActiveIndexChange?.(newIndex); // Notify parent about index change
        return newIndex;
      });
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, [items.length, isHovered, onActiveIndexChange]);

  // Notify parent about initial index
  useEffect(() => {
    onActiveIndexChange?.(0);
  }, [onActiveIndexChange]);

  // Notify parent when index changes manually
  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    onActiveIndexChange?.(index);
  }, [onActiveIndexChange]);

  const handleItemClick = useCallback((item: CarouselItem) => {
    if (item.link) {
      navigate(item.link);
    }
  }, [navigate]);

  const goToPrevious = useCallback(() => {
    setActiveIndex(prev => {
      const newIndex = prev === 0 ? items.length - 1 : prev - 1;
      onActiveIndexChange?.(newIndex);
      return newIndex;
    });
  }, [items.length, onActiveIndexChange]);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => {
      const newIndex = (prev + 1) % items.length;
      onActiveIndexChange?.(newIndex);
      return newIndex;
    });
  }, [items.length, onActiveIndexChange]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      {/* Main carousel container - exact layout from your image */}
      <div 
        className="relative w-full max-w-6xl h-[450px] flex items-center justify-center overflow-hidden auto-carousel-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {items.map((item, index) => {
          const offset = index - activeIndex;
          let adjustedOffset = offset;
          
          // Handle circular positioning
          if (Math.abs(offset) > items.length / 2) {
            adjustedOffset = offset > 0 ? offset - items.length : offset + items.length;
          }

          const isCenter = adjustedOffset === 0;
          const isVisible = Math.abs(adjustedOffset) <= 2;
          
          if (!isVisible) return null;

          // Card positioning - exactly like in your image
          const translateX = adjustedOffset * 200; // Space between cards
          const translateZ = isCenter ? 0 : -Math.abs(adjustedOffset) * 100;
          const rotateY = adjustedOffset * 25; // 3D rotation
          const scale = isCenter ? 1 : 0.85;
          const opacity = isCenter ? 1 : 0.7;
          const zIndex = 10 - Math.abs(adjustedOffset);

          return (
            <div
              key={index}
              className="absolute cursor-pointer transition-all duration-700 ease-out carousel-card"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex
              }}
              onClick={() => isCenter ? handleItemClick(item) : goToSlide(index)}
            >
              {/* Image */}
              <div className="carousel-image-container">
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className={`carousel-image ${!isCenter ? 'dimmed' : ''}`}
                />
                
                {/* Gradient overlay */}
                <div className="carousel-gradient-overlay" />
              </div>

              {/* Content overlay - positioned like in your image */}
              <div className="carousel-content">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-lg font-bold mb-1 text-shadow">{item.title}</h3>
                <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
              </div>

              {/* Shine effect for center card */}
              {isCenter && (
                <div className="carousel-shine" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Navigation indicators */}
      <div className="flex items-center justify-center mt-8 space-x-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index 
                ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/50' 
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Manual navigation arrows */}
      <div className="flex items-center justify-center mt-4 space-x-8">
        <button 
          onClick={goToPrevious}
          className="p-3 rounded-full carousel-nav-btn text-white"
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="text-white/60 text-sm">
          {isHovered ? 'Paused' : 'Auto-rotating'}
        </div>
        
        <button 
          onClick={goToNext}
          className="p-3 rounded-full carousel-nav-btn text-white"
          aria-label="Next slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AutoCarousel3D;