import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { NavLink } from 'react-router-dom';
import { portfolioItems, PortfolioCategory } from '../data/portfolioData';
import LogoShowcase from '../components/ui/LogoShowcase';

type CategoryFilter = 'all' | PortfolioCategory;

const PortfolioPage: React.FC = () => {
  const { t } = useTranslations();
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const filteredItems = filter === 'all' ? portfolioItems : portfolioItems.filter(item => item.category === filter);

  const categories: { key: CategoryFilter, name: string }[] = [
    { key: 'all', name: 'All' },
    { key: 'graphics', name: t('services_teaser.graphics') },
    { key: 'photo', name: t('services_teaser.photo') },
    { key: 'websites', name: t('services_teaser.websites') },
    { key: 'video', name: t('services_teaser.video') }
  ];

  return (
    <div className="container mx-auto px-6 py-20">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-foreground drop-shadow-[0_0_8px_hsl(var(--accent))]">
        {t('portfolio_page.title')}
      </h1>
      
      {/* Logo Display */}
      <div className="flex justify-center mb-12">
        <LogoShowcase variant="compact" animated={true} />
      </div>
      
      <div className="flex justify-center flex-wrap gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${filter === cat.key ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/30' : 'bg-secondary text-muted-foreground hover:bg-muted'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div key={filter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className={`opacity-0 animate-fade-in-up flex flex-col [animation-fill-mode:forwards]`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Karta portfolio */}
            {item.externalLink ? (
              // Dla stron internetowych - tylko obrazek bez linku
              <div className="block uiverse-card group p-0 mb-4">
                <div className="uiverse-card-circles">
                    <div></div><div></div><div></div>
                </div>
                <div className="uiverse-card-content relative z-10 w-full h-full p-0 overflow-hidden">
                  <img src={item.img} alt={t(item.titleKey)} className="w-full h-full object-cover rounded-[1.8rem]" />
                </div>
              </div>
            ) : (
              // Dla pozostałych - z linkiem do detail page
              <NavLink
                to={`/portfolio/${item.id}`}
                className="block uiverse-card group p-0 mb-4"
              >
                <div className="uiverse-card-circles">
                    <div></div><div></div><div></div>
                </div>
                <div className="uiverse-card-content relative z-10 w-full h-full p-0 overflow-hidden">
                    {item.video ? (
                      <video 
                        src={item.video} 
                        className="w-full h-full object-cover rounded-[1.8rem]"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                    ) : (
                      <img src={item.img} alt={t(item.titleKey)} className="w-full h-full object-cover rounded-[1.8rem]" />
                    )}
                </div>
              </NavLink>
            )}
            
            {/* Przycisk dla stron internetowych */}
            {item.externalLink && (
              <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Odwiedź stronę
              </a>
            )}
          </div>
        ))}
      </div>

       <div className="text-center mt-20">
          <NavLink to="/contact" className="mt-8 inline-block bg-gold text-brand-dark font-bold py-3 px-8 rounded-full text-lg hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_hsl(var(--gold-accent)/0.5)]">
            {t('portfolio.cta')}
          </NavLink>
       </div>
    </div>
  );
};

export default PortfolioPage;
