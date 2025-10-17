import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Portfolio3DItem } from '../../data/portfolioData';
import { useTranslations } from '../../hooks/useTranslations';

interface PortfolioCarousel3DProps {
  items: Portfolio3DItem[];
}

const PortfolioCarousel3D: React.FC<PortfolioCarousel3DProps> = ({ items }) => {
  const { t } = useTranslations();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Minimum distance to trigger a swipe
  const minSwipeDistance = 50;

  // Auto-rotation effect - stops when video is playing OR when hovered
  useEffect(() => {
    if (isHovered || isVideoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % items.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [items.length, isHovered, isVideoPlaying]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex(prev => prev === 0 ? items.length - 1 : prev - 1);
  }, [items.length]);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      {/* Portfolio Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t('portfolio_page.title')}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('portfolio_page.subtitle')}
        </p>
      </div>

      {/* Main carousel container - matching your image layout */}
      <div 
        className="relative w-full max-w-7xl h-[500px] flex items-center justify-center overflow-hidden portfolio-carousel-container touch-pan-y"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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
          const translateX = adjustedOffset * 250; // Space between cards
          const translateZ = isCenter ? 0 : -Math.abs(adjustedOffset) * 120;
          const rotateY = adjustedOffset * 35; // 3D rotation angle
          const scale = isCenter ? 1 : 0.8;
          const opacity = isCenter ? 1 : 0.6;
          const zIndex = 10 - Math.abs(adjustedOffset);

          return (
            <div
              key={item.id}
              className="absolute cursor-pointer transition-all duration-700 ease-out portfolio-card"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex
              }}
              onClick={() => !isCenter && goToSlide(index)}
            >
              {/* Portfolio Media (Image or Video) */}
              <div className="w-[350px] h-[500px] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl border-2 border-blue-500/30 relative">
                {item.image.endsWith('.mp4') ? (
                  <video
                    src={item.image}
                    className="w-full h-full object-cover"
                    controls={isCenter}
                    autoPlay={isCenter}
                    loop
                    playsInline
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                  />
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Hover indicator */}
              {!isCenter && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                      <circle cx="12" cy="12" r="10"/>
                      <polygon points="10,8 16,12 10,16 10,8"/>
                    </svg>
                  </div>
                </div>
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
                : 'bg-gray-500 hover:bg-gray-400'
            }`}
            aria-label={`Go to portfolio item ${index + 1}`}
          />
        ))}
      </div>

      {/* Manual navigation and status */}
      <div className="flex items-center justify-between w-full max-w-md mt-6">
        <button 
          onClick={goToPrevious}
          className="p-3 rounded-full portfolio-nav-btn text-white group"
          aria-label="Previous portfolio item"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="text-center">
          <div className="text-white/60 text-sm">
            {isHovered ? '⏸️ Paused' : '▶️ Auto-rotating'}
          </div>
          <div className="text-white/40 text-xs mt-1">
            {activeIndex + 1} / {items.length}
          </div>
        </div>
        
        <button 
          onClick={goToNext}
          className="p-3 rounded-full portfolio-nav-btn text-white group"
          aria-label="Next portfolio item"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* CTA Button */}
      <div className="mt-8">
        <NavLink 
          to="/portfolio" 
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl inline-block"
        >
          {t('portfolio.view_all')}
        </NavLink>
      </div>
    </div>
  );
};

export default PortfolioCarousel3D;