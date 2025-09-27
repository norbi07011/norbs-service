import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslations();
  return (
    <footer className="bg-glass border-t border-border-color mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">NORBS SERVICE</h3>
            <p className="text-muted-foreground">{t('hero.title')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('contact.title')}</h3>
            <ul className="text-muted-foreground space-y-2">
              <li>Email: servicenorbs@gmail.com</li>
              <li>WhatsApp: +31 6 33387724</li>
              <li>Adres: Braamstraat 19, 2681GL, Monster, Netherlands</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Social Media</h3>
            {/* Placeholder for social links */}
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">Facebook</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border-color pt-4 flex flex-col sm:flex-row justify-between items-center text-muted-foreground text-sm gap-4">
          <span>&copy; {new Date().getFullYear()} NORBS SERVICE. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <NavLink to="/terms" className="hover:text-accent transition-colors">{t('nav.terms')}</NavLink>
            <NavLink to="/privacy-policy" className="hover:text-accent transition-colors">{t('nav.privacyPolicy')}</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;