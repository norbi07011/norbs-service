import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { useOnScreen } from '../hooks/useOnScreen';
import ImageCarousel3D from '../components/ui/ImageCarousel3D';

// Helper component for animated sections
const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref, { threshold: 0.2 });
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
  
  const carouselItems = [
    { 
      icon: "🎨", 
      title: t('hero_carousel.graphics.title'), 
      description: t('hero_carousel.graphics.description'),
      imgSrc: "https://images.unsplash.com/photo-1572044162444-24c9562b55da?q=80&w=1887&auto=format&fit=crop"
    },
    { 
      icon: "📷", 
      title: t('hero_carousel.photo.title'), 
      description: t('hero_carousel.photo.description'),
      imgSrc: "https://images.unsplash.com/photo-1520390138845-ff2d662dd554?q=80&w=2072&auto=format&fit=crop"
    },
    { 
      icon: "🌐", 
      title: t('hero_carousel.websites.title'), 
      description: t('hero_carousel.websites.description'),
      imgSrc: "https://images.unsplash.com/photo-1555774698-0b77e0abfe7c?q=80&w=2128&auto=format&fit=crop"
    },
    { 
      icon: "🎬", 
      title: t('hero_carousel.video.title'), 
      description: t('hero_carousel.video.description'),
      imgSrc: "https://images.unsplash.com/photo-1526233139368-7d125770380b?q=80&w=1887&auto=format&fit=crop"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(Math.floor(carouselItems.length / 2));
  const currentItem = carouselItems[activeIndex];

  return (
    <div className="space-y-24 md:space-y-32 overflow-x-hidden pb-16">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 -mt-20 overflow-hidden relative transition-all duration-700">
         {/* Dynamic Background */}
        {carouselItems.map((item, index) => (
          <div
            key={item.imgSrc}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${item.imgSrc})` }}
          />
        ))}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md"></div>
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.2),transparent_80%)]"></div>

        <div className="relative container mx-auto px-6 text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight animate-glitch" style={{ textShadow: '0 0 8px hsl(var(--accent)), 0 0 12px hsl(var(--gold-accent))'}}>
                {t('hero.title')}
            </h1>
             <p className="max-w-3xl mx-auto text-lg text-muted-foreground mt-4">
                {t('hero.subtitle')}
            </p>
        </div>
        <div className="relative w-full">
            <ImageCarousel3D items={carouselItems} activeIndex={activeIndex} onIndexChange={setActiveIndex} />
        </div>
      </section>

      {/* Services Teaser */}
      <AnimatedSection className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">{t('services_teaser.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard icon="🎨" title={t('services_teaser.graphics')} />
          <ServiceCard icon="📷" title={t('services_teaser.photo')} />
          <ServiceCard icon="🌐" title={t('services_teaser.websites')} />
          <ServiceCard icon="🎬" title={t('services_teaser.video')} />
        </div>
      </AnimatedSection>
      
      {/* Portfolio Teaser */}
      <AnimatedSection className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Portfolio</h2>
          <div className="relative w-full h-64 md:h-80 [perspective:1000px] flex justify-center items-center">
             <div className="w-full h-full relative [transform-style:preserve-d] animate-carousel-spin">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute w-48 h-64 md:w-64 md:h-80 [transform-style:preserve-3d]" style={{ transform: `rotateY(${i * 60}deg) translateZ(400px)` }}>
                         <img src={`https://picsum.photos/400/600?random=${i+10}`} alt={`Portfolio item ${i}`} className="w-full h-full object-cover rounded-xl border-2 border-accent/50 animate-image-spin"/>
                    </div>
                ))}
            </div>
          </div>
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