import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslations } from '../../hooks/useTranslations';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import Typewriter from '../ui/Typewriter';


const CardColorSwitcher: React.FC = () => {
  const { cardColor, setCardColor } = useTheme();
  const { t } = useTranslations();
  const isChecked = cardColor === 'green';

  const handleChange = () => {
    setCardColor(isChecked ? 'blue' : 'green');
  };

  return (
    <label htmlFor="color-toggle" className="futuristic-toggle" title="Switch Card Color">
      <input
        id="color-toggle"
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        aria-label="Switch between green and blue card colors"
      />
      <span className="slider">
        <span className="on">{t('card_color.green')}</span>
        <span className="off">{t('card_color.blue')}</span>
      </span>
    </label>
  );
};

const Header: React.FC = () => {
  const { t } = useTranslations();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', text: t('nav.home') },
    { to: '/services', text: t('nav.services') },
    { to: '/clothing', text: t('hero_carousel.clothing.title') },
    { to: '/portfolio', text: t('nav.portfolio') },
    { to: '/about', text: t('nav.about') },
    { to: '/contact', text: t('nav.contact') },
  ];
  
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-accent after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${isActive ? 'text-accent after:scale-x-100' : ''}`;

  const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-300 rounded-lg ${isActive ? 'text-accent bg-accent/10' : ''}`;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border-color">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl" onClick={closeMobileMenu}>
          <Typewriter text="NORBS SERVICE" className="logo-3d-effect" />
        </NavLink>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={getNavLinkClass}
            >
              {link.text}
            </NavLink>
          ))}
           {user && user.role === 'owner' && (
            <NavLink to="/admin" className={getNavLinkClass}>
              Admin Panel
            </NavLink>
          )}
          {user && user.role === 'client' && (
            <NavLink to="/portal" className={getNavLinkClass}>
              Client Portal
            </NavLink>
          )}
        </div>
        
        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <CardColorSwitcher />
          {user ? (
            <button onClick={logout} className="px-4 py-2 text-sm font-semibold text-destructive bg-destructive/10 rounded-md hover:bg-destructive/20 transition-colors">
              {t('auth.logout') || 'Logout'}
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className="px-4 py-2 text-sm font-semibold text-accent bg-accent/10 rounded-md hover:bg-accent/20 transition-colors"
            >
              {t('auth.login') || 'Admin Login'}
            </NavLink>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          
          {/* Burger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="container mx-auto px-6 py-4 bg-background/95 backdrop-blur-lg border-t border-border-color">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={getMobileNavLinkClass}
                onClick={closeMobileMenu}
              >
                {link.text}
              </NavLink>
            ))}
            {user && user.role === 'owner' && (
              <NavLink to="/admin" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
                Admin Panel
              </NavLink>
            )}
            {user && user.role === 'client' && (
              <NavLink to="/portal" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
                Client Portal
              </NavLink>
            )}
          </div>
          
          {/* Mobile Auth & Settings */}
          <div className="mt-4 pt-4 border-t border-border-color space-y-3">
            <div className="flex items-center gap-2">
              <CardColorSwitcher />
            </div>
            {user ? (
              <button 
                onClick={() => { logout(); closeMobileMenu(); }} 
                className="w-full px-4 py-3 text-left text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
              >
                {t('auth.logout') || 'Logout'}
              </button>
            ) : (
              <NavLink 
                to="/login" 
                className="block w-full px-4 py-3 text-center text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                onClick={closeMobileMenu}
              >
                {t('auth.login') || 'Admin Login'}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;