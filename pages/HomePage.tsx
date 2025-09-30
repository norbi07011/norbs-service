import React, { useRef, useState, RefObject } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { useOnScreen } from '../hooks/useOnScreen';
import AutoCarousel3D from '../components/ui/AutoCarousel3D';
import PortfolioCarousel3D from '../components/ui/PortfolioCarousel3D';
import { portfolio3DItems } from '../data/portfolioData';

// Helper component for animated sections
const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref as RefObject<Element>, { threshold: 0.2 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${className} ${isOnScreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </div>
  );
};

// Helper component for service cards
const ServiceCard: React.FC<{ icon: string, title: string }> = ({ icon, title }) => (
  <div className="uiverse-card items-center justify-center">
    <div className="uiverse-card-circles">
        <div></div><div></div><div></div>
    </div>
    <div className="uiverse-card-content relative z-10 text-center">
      <div className="text-4xl text-foreground mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
    </div>
  </div>
);

// Helper component for info cards
const InfoCard: React.FC<{ title: string; description: string; icon: string; }> = ({ title, description, icon }) => (
    <div className="uiverse-card h-64 items-center justify-center">
        <div className="uiverse-card-circles">
            <div></div><div></div><div></div>
        </div>
        <div className="uiverse-card-content relative z-10 flex flex-col items-center text-center">
            <div className="text-4xl text-foreground mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);


const HomePage: React.FC = () => {
  const { t } = useTranslations();
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  
  const carouselItems = [
    {
      icon: '🎨',
      title: 'Projekty Graficzne',
      description: 'Profesjonalne logo, ulotki, wizytówki i materiały marketingowe',
      imgSrc: '/images/Projekty-graficzne.jpg'
    },
    {
      icon: '🌐',
      title: 'Strony Internetowe',
      description: 'Nowoczesne, responsywne strony WWW i sklepy internetowe',
      imgSrc: '/images/Strony-internetowe.jpg'
    },
    {
      icon: '📷',
      title: 'Sesje Zdjęciowe',
      description: 'Profesjonalne zdjęcia produktowe, portretowe i eventowe',
      imgSrc: '/images/Fotografia.jpg'
    },
    {
      icon: '🎬',
      title: 'Produkcja Video',
      description: 'Filmy promocyjne, klipy muzyczne i content na social media',
      imgSrc: '/images/Wideo-marketing.jpg'
    },
    {
      icon: '👕',
      title: t('hero_carousel.clothing.title'),
      description: t('hero_carousel.clothing.description'),
      imgSrc: '/images/Clothing-design.jpg',
      link: '/clothing'
    }
  ];  return (
    <div className="space-y-24 md:space-y-32 overflow-x-hidden pb-16">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 -mt-20 relative transition-all duration-700">
        {/* Dynamic background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${carouselItems[activeCarouselIndex]?.imgSrc})`,
          }}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md"></div>
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.2),transparent_80%)]"></div>

        <div className="relative container mx-auto px-6 text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight animate-glitch hero-title">
                {t('hero.title')}
            </h1>
             <p className="max-w-3xl mx-auto text-lg text-muted-foreground mt-4">
                {t('hero.subtitle')}
            </p>
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 overflow-visible">
            <AutoCarousel3D 
              items={carouselItems}
              onActiveIndexChange={setActiveCarouselIndex}
            />
        </div>
      </section>

      {/* Services Teaser */}
      <AnimatedSection className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{t('services_teaser.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <ServiceCard icon="🎨" title={t('services_teaser.graphics')} />
          <ServiceCard icon="📷" title={t('services_teaser.photo')} />
          <ServiceCard icon="🌐" title={t('services_teaser.websites')} />
          <ServiceCard icon="🎬" title={t('services_teaser.video')} />
          <ServiceCard icon="👕" title={t('services_teaser.clothing')} />
        </div>
      </AnimatedSection>
      
      {/* Portfolio Carousel 3D */}
      <AnimatedSection className="w-full">
        <PortfolioCarousel3D items={portfolio3DItems} />
      </AnimatedSection>

      {/* Why NORBS SERVICE? */}
      <AnimatedSection className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{t('why_us.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <InfoCard title={t('why_us.price')} description={t('why_us.price_desc')} icon="💰" />
          <InfoCard title={t('why_us.design')} description={t('why_us.design_desc')} icon="🎨" />
          <InfoCard title={t('why_us.speed')} description={t('why_us.speed_desc')} icon="🚀" />
          <InfoCard title={t('why_us.languages')} description={t('why_us.languages_desc')} icon="🌎" />
        </div>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;