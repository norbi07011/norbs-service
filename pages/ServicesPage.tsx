import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { useOnScreen } from '../hooks/useOnScreen';

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
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-foreground" style={{ textShadow: '0 0 8px hsl(var(--accent))' }}>
        {t('services_page.title')}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <AnimatedSection>
          <ServiceCategory icon="🎨" title={t('services_page.graphics_title')}>
            <PricingItem name={t('services_page.graphics.logo')} price={t('services_page.graphics.price_logo')} />
            <PricingItem name={t('services_page.graphics.business_cards')} price={t('services_page.graphics.price_business_cards')} />
            <PricingItem name={t('services_page.graphics.posters')} price={t('services_page.graphics.price_posters')} />
            <PricingItem name={t('services_page.graphics.banners')} price={t('services_page.graphics.price_banners')} />
          </ServiceCategory>
        </AnimatedSection>
        
        <AnimatedSection>
          <ServiceCategory icon="📷" title={t('services_page.photo_title')}>
            <PricingItem name={t('services_page.photo.photoshoot')} price={t('services_page.photo.price')} />
            <li className="text-muted-foreground text-sm p-2">{t('services_page.photo.description')}</li>
          </ServiceCategory>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-2">
            <ServiceCategory icon="🌐" title={t('services_page.websites_title')}>
                <PricingItem name={t('services_page.websites.simple')} price={t('services_page.websites.price_simple')} />
                <PricingItem name={t('services_page.websites.business')} price={t('services_page.websites.price_business')} popular={true} />
                <PricingItem name={t('services_page.websites.ecommerce')} price={t('services_page.websites.price_ecommerce')} />
                <PricingItem name={t('services_page.websites.admin')} price={t('services_page.websites.price_admin')} />
            </ServiceCategory>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-2">
          <ServiceCategory icon="🎬" title={t('services_page.video_title')}>
            <PricingItem name={t('services_page.video.promo')} price={t('services_page.video.price_promo')} />
            <PricingItem name={t('services_page.video.music')} price={t('services_page.video.price_music')} />
            <PricingItem name={t('services_page.video.reels_title')} price={t('services_page.video.price_reels')} />
            <li className="text-muted-foreground text-sm p-2">{t('services_page.video.reels_description')}</li>
          </ServiceCategory>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ServicesPage;