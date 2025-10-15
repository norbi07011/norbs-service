import React from 'react';

interface LogoShowcaseProps {
  variant?: 'hero' | 'featured' | 'compact';
  animated?: boolean;
}

const LogoShowcase: React.FC<LogoShowcaseProps> = ({ variant = 'featured', animated = true }) => {
  const variants = {
    hero: {
      container: 'w-full max-w-2xl mx-auto p-8',
      frame: 'relative p-12 rounded-3xl',
      logo: 'w-full h-auto'
    },
    featured: {
      container: 'w-full max-w-xl mx-auto p-6',
      frame: 'relative p-8 rounded-2xl',
      logo: 'w-full h-auto'
    },
    compact: {
      container: 'w-full max-w-md mx-auto p-4',
      frame: 'relative p-6 rounded-xl',
      logo: 'w-full h-auto'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={currentVariant.container}>
      {/* Outer glow effect */}
      <div className="relative">
        {/* Animated gradient border */}
        <div className={`${currentVariant.frame} bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 shadow-2xl ${animated ? 'animate-pulse-slow' : ''}`}>
          
          {/* Inner frame with glass effect */}
          <div className="relative bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl rounded-2xl p-8 border border-border/50">
            
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg"></div>

            {/* Glowing particles effect */}
            {animated && (
              <>
                <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-75 animation-delay-200"></div>
                <div className="absolute bottom-6 left-12 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75 animation-delay-400"></div>
                <div className="absolute bottom-10 right-6 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-75 animation-delay-600"></div>
              </>
            )}

            {/* Logo container with subtle animation */}
            <div className={`relative ${animated ? 'hover:scale-105 transition-transform duration-500' : ''}`}>
              <img 
                src="/images/norbs-logo-new.jpg" 
                alt="Norbs Service - Creative Digital Solutions" 
                className={currentVariant.logo}
                onError={(e) => {
                  // Fallback to old logo if new one doesn't exist
                  (e.target as HTMLImageElement).src = '/images/logo .jpg';
                }}
              />
              
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent rounded-lg pointer-events-none"></div>
            </div>

            {/* Shine effect on hover */}
            {animated && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
            )}
          </div>

          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10 blur-2xl -z-10 rounded-3xl"></div>
        </div>

        {/* External particles (decorative) */}
        {animated && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-sm opacity-40 animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-sm opacity-40 animate-float animation-delay-300"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-sm opacity-40 animate-float animation-delay-500"></div>
          </div>
        )}
      </div>

      {/* Company tagline */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground font-light tracking-wider">
          CREATIVE DIGITAL SOLUTIONS
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LogoShowcase;
