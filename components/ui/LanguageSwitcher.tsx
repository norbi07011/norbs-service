import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { Language } from '../../types';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'nl', name: 'NL', flag: '🇳🇱' },
  { code: 'en', name: 'EN', flag: '🇬🇧' },
  { code: 'tr', name: 'TR', flag: '🇹🇷' },
  { code: 'pl', name: 'PL', flag: '🇵🇱' },
  { code: 'de', name: 'DE', flag: '🇩🇪' },
  { code: 'fr', name: 'FR', flag: '🇫🇷' },
];

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-secondary border border-border rounded-md hover:bg-muted transition-colors h-10"
      >
        <span>{selectedLanguage.flag}</span>
        <span className="text-sm font-medium text-foreground">{selectedLanguage.name}</span>
        <svg className={`w-4 h-4 text-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-popover backdrop-blur-lg border border-border rounded-md shadow-lg py-1 z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors"
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;