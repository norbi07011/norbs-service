import React from 'react';

interface MinimalLogoCardProps {
  className?: string;
  glowEffect?: boolean;
}

const MinimalLogoCard: React.FC<MinimalLogoCardProps> = ({ 
  className = '',
  glowEffect = true 
}) => {
  return (
    <div className={`w-full max-w-xl md:max-w-2xl mx-auto ${className}`}>
      {/* Card with neomorphic design */}
      <div className="relative group">
        {/* Main card */}
        <div className="relative bg-gradient-to-br from-background to-muted/50 rounded-2xl p-8 md:p-12 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
          
          {/* Top decorative line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"></div>
          
          {/* Logo container */}
          <div className="relative aspect-square w-full mb-6 md:mb-8">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="0.5" fill="currentColor" />
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>

            {/* Logo image */}
            <div className="relative z-10 w-full h-full p-4 md:p-6">
              <img 
                src="/images/norbs-logo-new.jpg" 
                alt="Norbs Service" 
                className="w-full h-full object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/logo .jpg';
                }}
              />
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0">
              <svg width="50" height="50" viewBox="0 0 40 40">
                <path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" fill="hsl(var(--accent))" opacity="0.5" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 rotate-180">
              <svg width="50" height="50" viewBox="0 0 40 40">
                <path d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z" fill="hsl(var(--accent))" opacity="0.5" />
              </svg>
            </div>
          </div>

          {/* Company info */}
          <div className="text-center space-y-2 md:space-y-3">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              Norbs Service
            </h3>
            <div className="h-px w-20 md:w-24 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent"></div>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground tracking-widest">
              CREATIVE DIGITAL SOLUTIONS
            </p>
          </div>

          {/* Floating particles */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-40"></div>
          <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40 animation-delay-500"></div>
        </div>

        {/* Glow effect */}
        {glowEffect && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        )}

        {/* Subtle border animation */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
        </div>
      </div>

      <style>{`
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
};

export default MinimalLogoCard;
