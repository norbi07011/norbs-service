import React, { useRef, RefObject } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { useOnScreen } from '../hooks/useOnScreen';
import MinimalLogoCard from '../components/ui/MinimalLogoCard';

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

interface PricingItemProps {
  name: string;
  price: string;
  popular?: boolean;
}

const PricingItem: React.FC<PricingItemProps> = ({ name, price, popular }) => (
  <li className={`flex justify-between items-center p-4 rounded-lg transition-colors ${popular ? 'bg-accent/10' : 'bg-glass'}`}>
    <span className="text-foreground">{name}</span>
    <span className="font-bold text-foreground">{price}</span>
  </li>
);

interface ServiceCategoryProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}
const ServiceCategory: React.FC<ServiceCategoryProps> = ({ icon, title, children }) => (
    <div className="uiverse-card">
      <div className="uiverse-card-circles">
        <div></div><div></div><div></div>
      </div>
      <div className="uiverse-card-content relative z-10 w-full text-left">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-4 text-foreground"><span className="text-4xl">{icon}</span> {title}</h3>
        <ul className="space-y-3 mb-6">
          {children}
        </ul>
        <NavLink to="/contact" className="w-full mt-4 inline-block bg-accent text-accent-foreground text-center font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_hsl(var(--accent)/0.5)]">
            {useTranslations().t('services_page.order_cta')}
        </NavLink>
      </div>
    </div>
);


const ServicesPage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-foreground text-shadow-accent">
        {t('services_page.title')}
      </h1>
      
      {/* Logo Card */}
      <AnimatedSection className="mb-16">
        <MinimalLogoCard />
      </AnimatedSection>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <AnimatedSection>
          <ServiceCategory icon="🎨" title={t('services_page.graphics_title')}>
            <PricingItem name={t('services_page.graphics.logo')} price={t('services_page.graphics.price_logo')} />
            <PricingItem name={t('services_page.graphics.business_cards')} price={t('services_page.graphics.price_business_cards')} />
            <PricingItem name={t('services_page.graphics.posters')} price={t('services_page.graphics.price_posters')} />
            <PricingItem name={t('services_page.graphics.banners')} price={t('services_page.graphics.price_banners')} />
            <PricingItem name={t('services_page.graphics.general_graphics')} price={t('services_page.graphics.price_general_graphics')} />
          </ServiceCategory>
        </AnimatedSection>
        
        <AnimatedSection>
          <ServiceCategory icon="📷" title={t('services_page.photo_title')}>
            <PricingItem name={t('services_page.photo.photoshoot')} price={t('services_page.photo.price')} />
            <p className="text-muted-foreground text-sm p-2">{t('services_page.photo.description')}</p>
          </ServiceCategory>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-2">
          <ServiceCategory icon="👕" title={t('services_page.clothing_title')}>
            <div className="text-center py-8">
              <p className="text-2xl font-bold text-accent mb-4">{t('services_page.clothing.coming_soon')}</p>
              <p className="text-muted-foreground text-sm">{t('services_page.clothing.description')}</p>
            </div>
          </ServiceCategory>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-2">
            <ServiceCategory icon="🌐" title={t('services_page.websites_title')}>
                <PricingItem name={t('services_page.websites.simple')} price={t('services_page.websites.price_simple')} />
                <PricingItem name={t('services_page.websites.business')} price={t('services_page.websites.price_business')} popular={true} />
                <PricingItem name={t('services_page.websites.advanced')} price={t('services_page.websites.price_advanced')} />
                <PricingItem name={t('services_page.websites.ecommerce')} price={t('services_page.websites.price_ecommerce')} />
            </ServiceCategory>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-2">
          <ServiceCategory icon="🎬" title={t('services_page.video_title')}>
            <PricingItem name={t('services_page.video.promo')} price={t('services_page.video.price_promo')} />
            <PricingItem name={t('services_page.video.music')} price={t('services_page.video.price_music')} />
            <PricingItem name={t('services_page.video.reels_title')} price={t('services_page.video.price_reels')} />
            <p className="text-muted-foreground text-sm p-2">{t('services_page.video.reels_description')}</p>
          </ServiceCategory>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ServicesPage;