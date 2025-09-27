import React, { useCallback } from 'react';

interface CarouselItem {
  icon: string;
  title: string;
  description: string;
  imgSrc: string;
}

interface ImageCarousel3DProps {
  items: CarouselItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

const ImageCarousel3D: React.FC<ImageCarousel3DProps> = ({ items, activeIndex, onIndexChange }) => {
  const goToPrevious = useCallback(() => {
    onIndexChange(activeIndex === 0 ? items.length - 1 : activeIndex - 1);
  }, [activeIndex, items.length, onIndexChange]);

  const goToNext = useCallback(() => {
    onIndexChange(activeIndex === items.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, items.length, onIndexChange]);

  const goToSlide = (index: number) => {
    onIndexChange(index);
  };
  
  const getSlideStyle = (index: number): React.CSSProperties => {
    const offset = index - activeIndex;

    // Handle wrapping for a smoother loop illusion
    let adjustedOffset = offset;
    if (Math.abs(offset) > items.length / 2) {
      adjustedOffset = offset > 0 ? offset - items.length : offset + items.length;
    }
    
    const isFar = Math.abs(adjustedOffset) > 2;

    const scale = 1 - Math.abs(adjustedOffset) * 0.2;
    const translateX = adjustedOffset * 45;
    const zIndex = items.length - Math.abs(adjustedOffset);
    const opacity = isFar ? 0 : 1 - Math.abs(adjustedOffset) * 0.3;
    const filter = `blur(${Math.abs(adjustedOffset) * 2}px)`;

    return {
      position: 'absolute',
      width: 'clamp(220px, 30vw, 300px)',
      height: 'clamp(320px, 45vh, 450px)',
      transform: `translateX(${translateX}%) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      filter: filter,
      transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease, filter 0.6s ease',
      pointerEvents: isFar ? 'none' : 'auto',
    };
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-full h-[clamp(380px,55vh,500px)] flex items-center justify-center [perspective:1500px]">
        {items.map((item, index) => (
          <div key={index} style={getSlideStyle(index)} className="cursor-pointer" onClick={() => index !== activeIndex && goToSlide(index)}>
             <div className="uiverse-card w-full h-full p-0 overflow-hidden">
                <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                
                <div className="uiverse-card-content relative z-10 w-full h-full p-0">
                    <img src={item.imgSrc} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    <div className="relative w-full h-full flex flex-col justify-end p-6 text-white">
                       <div className={`transition-all duration-500 ${activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="text-4xl mb-2">{item.icon}</div>
                            <h3 className="text-2xl font-bold">{item.title}</h3>
                            <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                      </div>
                    </div>
                </div>
              </div>
          </div>
        ))}
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-center mt-8 space-x-12 relative z-10">
        <button onClick={goToPrevious} className="p-3 bg-glass rounded-full border border-border-color hover:bg-accent/20 transition-colors text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="flex items-center space-x-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-accent scale-125' : 'bg-muted hover:bg-muted-foreground/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button onClick={goToNext} className="p-3 bg-glass rounded-full border border-border-color hover:bg-accent/20 transition-colors text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel3D;