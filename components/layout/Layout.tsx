import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import StickyCTA from '../ui/StickyCTA';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <StickyCTA />
    </div>
  );
};

export default Layout;