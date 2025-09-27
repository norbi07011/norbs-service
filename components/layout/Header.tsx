import React from 'react';
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

  const navLinks = [
    { to: '/', text: t('nav.home') },
    { to: '/services', text: t('nav.services') },
    { to: '/portfolio', text: t('nav.portfolio') },
    { to: '/about', text: t('nav.about') },
    { to: '/contact', text: t('nav.contact') },
  ];
  
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-accent after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${isActive ? 'text-accent after:scale-x-100' : ''}`;


  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border-color">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl">
          <Typewriter text="NORBS SERVICE" className="logo-3d-effect" />
        </NavLink>
        <div className="hidden md:flex items-center space-x-6">
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
        <div className="flex items-center gap-2">
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
      </nav>
    </header>
  );
};

export default Header;