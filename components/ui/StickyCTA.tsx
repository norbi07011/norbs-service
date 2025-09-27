import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { NavLink } from 'react-router-dom';

const StickyCTA: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/50 backdrop-blur-lg z-40 flex justify-center items-center gap-4 border-t border-border-color">
      <NavLink 
        to="/contact"
        className="px-6 py-2 text-sm font-semibold text-accent-foreground bg-accent rounded-full shadow-lg shadow-accent/30 hover:bg-opacity-80 transform hover:scale-105 transition-all duration-300"
      >
        {t('cta.quote')}
      </NavLink>
      <a 
        href="https://wa.me/31633387724" 
        target="_blank" 
        rel="noopener noreferrer"
        className="px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-full shadow-lg shadow-green-500/30 hover:bg-opacity-80 transform hover:scale-105 transition-all duration-300"
      >
        {t('cta.whatsapp')}
      </a>
    </div>
  );
};

export default StickyCTA;