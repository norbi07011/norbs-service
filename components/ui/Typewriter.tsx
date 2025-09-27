
import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, className, speed = 150 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // Reset state when text prop changes
    setDisplayText('');
    setIsTyping(true);
    
    const typingInterval = setInterval(() => {
      setDisplayText(currentText => {
        if (currentText.length < text.length) {
          return text.substring(0, currentText.length + 1);
        } else {
          clearInterval(typingInterval);
          // Set a timeout to hide the cursor after typing is done
          setTimeout(() => setIsTyping(false), 2000); 
          return text;
        }
      });
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayText}
      {isTyping && <span className="inline-block w-0.5 h-[1em] ml-1 bg-foreground animate-pulse" />}
    </span>
  );
};


export default Typewriter;