import React from 'react';

interface LogoFrameProps {
  position?: 'left' | 'right' | 'center';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const LogoFrame: React.FC<LogoFrameProps> = ({ 
  position = 'center', 
  size = 'medium',
  showText = true 
}) => {
  const sizes = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  const positions = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center'
  };

  return (
    <div className={`flex ${positions[position]} items-center py-8`}>
      <div className="relative group">
        {/* Hexagonal frame */}
        <div className="relative">
          {/* Outer hexagon with gradient border */}
          <div className={`${sizes[size]} relative`}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Hexagon path */}
              <path
                d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
                fill="none"
                stroke="url(#hexGradient)"
                strokeWidth="2"
                filter="url(#glow)"
                className="group-hover:stroke-[3] transition-all duration-300"
              />
              
              {/* Inner hexagon */}
              <path
                d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
                fill="hsl(var(--background))"
                fillOpacity="0.8"
                className="backdrop-blur-sm"
              />

              {/* Decorative dots on corners */}
              <circle cx="50" cy="5" r="2" fill="#8B5CF6" className="animate-pulse" />
              <circle cx="90" cy="27.5" r="2" fill="#3B82F6" className="animate-pulse animation-delay-200" />
              <circle cx="90" cy="72.5" r="2" fill="#EC4899" className="animate-pulse animation-delay-400" />
              <circle cx="50" cy="95" r="2" fill="#8B5CF6" className="animate-pulse animation-delay-600" />
              <circle cx="10" cy="72.5" r="2" fill="#3B82F6" className="animate-pulse animation-delay-800" />
              <circle cx="10" cy="27.5" r="2" fill="#EC4899" className="animate-pulse animation-delay-1000" />
            </svg>

            {/* Logo image inside hexagon */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <img 
                src="/images/norbs-logo-new.jpg" 
                alt="Norbs Service Logo" 
                className="w-full h-full object-contain rounded-lg transform group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/logo .jpg';
                }}
              />
            </div>
          </div>

          {/* Rotating ring effect */}
          <div className="absolute inset-0 animate-spin-slow opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="url(#hexGradient)" 
                strokeWidth="0.5"
                strokeDasharray="10 5"
              />
            </svg>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Company name and tagline */}
        {showText && (
          <div className="mt-4 text-center">
            <h3 className="text-xl font-bold text-foreground tracking-wide">
              Norbs Service
            </h3>
            <p className="text-xs text-muted-foreground mt-1 tracking-wider">
              CREATIVE DIGITAL SOLUTIONS
            </p>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .animation-delay-800 {
          animation-delay: 800ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default LogoFrame;
