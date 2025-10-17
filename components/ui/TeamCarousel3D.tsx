import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import '../../styles/team-carousel.css';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  skills: string[];
  experience: string;
  social: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    email?: string;
  };
}

const TeamCarousel3D: React.FC = () => {
  const { t } = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Minimum distance to trigger a swipe
  const minSwipeDistance = 50;

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Norbi",
      role: t('team.norbi.role'),
      description: t('team.norbi.description'),
      image: "/images/norbi.jpg",
      skills: ["Marketing Digital", "Web Development", "Graphic Design", "Branding"],
      experience: t('team.norbi.experience'),
      social: {
        email: "servicenorbs@gmail.com",
        linkedin: "tel:+31642474314"
      }
    },
    {
      id: 2,
      name: "Martin",
      role: t('team.martin.role'),
      description: t('team.martin.description'),
      image: "/images/MARTIN .jpg",
      skills: ["Fashion Design", "Textile Design", "Pattern Making", "Brand Identity"],
      experience: t('team.martin.experience'),
      social: {
        instagram: "https://www.facebook.com/share/14JdrSnstks/"
      }
    },
    {
      id: 3,
      name: "JACKREATOR",
      role: t('team.jackreator.role'),
      description: t('team.jackreator.description'),
      image: "/images/JACKO PACKO .jpg",
      skills: [t('team.jackreator.skills.video_production'), t('team.jackreator.skills.video_editing'), t('team.jackreator.skills.special_effects')],
      experience: t('team.jackreator.experience'),
      social: {
        instagram: "https://www.instagram.com/jd_video_productions/",
        linkedin: "https://www.facebook.com/share/17Uw3PV7y6/"
      }
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 5000);
  };

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
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    setIsAutoRotating(false);
    setTimeout(() => setIsAutoRotating(true), 5000);
  };

  useEffect(() => {
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full py-16">
      {/* Main Carousel Container */}
      <div 
        className="relative min-h-[700px] md:h-[700px] overflow-visible touch-pan-y pb-20 md:pb-0" 
        ref={carouselRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-visible">
          <div className="team-carousel-3d relative w-full h-full">
            {teamMembers.map((member, index) => {
              const angle = (index - currentIndex) * (360 / teamMembers.length);
              const isActive = index === currentIndex;
              const isAdjacent = Math.abs(index - currentIndex) === 1 || 
                                (currentIndex === 0 && index === teamMembers.length - 1) ||
                                (currentIndex === teamMembers.length - 1 && index === 0);
              
              const cardClass = isActive ? 'active' : isAdjacent ? 'adjacent' : 'distant';
              
              return (
                <div
                  key={member.id}
                  className={`team-member-card absolute top-1/2 left-1/2 cursor-pointer ${cardClass}`}
                  data-rotation={angle}
                  onClick={() => goToSlide(index)}
                >
                  {/* Modern Member Card */}
                  <div className={`relative w-80 sm:w-96 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl rounded-3xl border-2 shadow-2xl transition-all duration-500 overflow-hidden ${
                    isActive ? 'border-blue-500/50 shadow-blue-500/20' : 'border-gray-700/30'
                  }`}>
                    
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    
                    {/* Content Container */}
                    <div className="relative z-10">
                      {/* Member Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                        
                        {/* Experience Badge */}
                        <div className="absolute top-4 right-4 px-4 py-2 bg-blue-500/90 backdrop-blur-sm rounded-full">
                          <span className="text-white text-xs font-bold">{member.experience}</span>
                        </div>
                      </div>
                      
                      {/* Member Info */}
                      <div className="p-6 space-y-4">
                        {/* Name & Role */}
                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                          <p className="text-blue-400 font-medium text-sm leading-relaxed">{member.role}</p>
                        </div>
                        
                        {/* Description - Only for Active */}
                        {isActive && (
                          <div className="space-y-4 animate-fade-in">
                            <p className="text-sm text-gray-300 text-center leading-relaxed px-2">
                              {member.description}
                            </p>
                            
                            {/* Skills Pills */}
                            <div className="flex flex-wrap gap-2 justify-center">
                              {member.skills.slice(0, 4).map((skill, skillIndex) => (
                                <span 
                                  key={skillIndex} 
                                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-xs rounded-full text-blue-300 font-medium backdrop-blur-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            
                            {/* Social Links with Icons */}
                            <div className="flex justify-center items-center gap-3 pt-3">
                              {member.social.email && (
                                <a
                                  href={`mailto:${member.social.email}`}
                                  className="group relative p-3 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-300 hover:scale-110 border border-gray-700 hover:border-blue-500"
                                  title="Email"
                                >
                                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                  </svg>
                                </a>
                              )}
                              {member.social.instagram && (
                                <a
                                  href={member.social.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative p-3 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-pink-600 hover:to-purple-600 rounded-xl transition-all duration-300 hover:scale-110 border border-gray-700 hover:border-pink-500"
                                  title="Instagram"
                                >
                                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                  </svg>
                                </a>
                              )}
                              {member.social.linkedin && (
                                <a
                                  href={member.social.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative p-3 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-300 hover:scale-110 border border-gray-700 hover:border-blue-500"
                                  title="Facebook/LinkedIn"
                                >
                                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                </a>
                              )}
                              {member.social.github && (
                                <a
                                  href={member.social.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative p-3 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl transition-all duration-300 hover:scale-110 border border-gray-700 hover:border-gray-500"
                                  title="GitHub"
                                >
                                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center space-x-8 mt-8">
        <button
          onClick={prevSlide}
          className="p-3 bg-background/80 hover:bg-accent hover:text-accent-foreground border border-border rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          aria-label="Previous team member"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-accent scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
              }`}
              aria-label={`Go to team member ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-3 bg-background/80 hover:bg-accent hover:text-accent-foreground border border-border rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          aria-label="Next team member"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Auto-rotation toggle */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isAutoRotating 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background'
          }`}
        >
          {isAutoRotating ? '⏸️ Pause' : '▶️ Auto Play'}
        </button>
      </div>
    </div>
  );
};

export default TeamCarousel3D;