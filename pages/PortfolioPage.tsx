import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { NavLink } from 'react-router-dom';
import { portfolioItems, PortfolioCategory } from '../data/portfolioData';

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
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-foreground" style={{ textShadow: '0 0 8px hsl(var(--accent))' }}>
        Portfolio
      </h1>
      
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

      <div key={filter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map((item, index) => (
          <NavLink
            key={item.id}
            to={`/portfolio/${item.id}`}
            className="block uiverse-card group p-0 aspect-square opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="uiverse-card-circles">
                <div></div><div></div><div></div>
            </div>
            <div className="uiverse-card-content relative z-10 w-full h-full p-0">
                <img src={item.img} alt={t(item.titleKey)} className="w-full h-full object-cover rounded-[1.8rem]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 rounded-[1.8rem]">
                    <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{t(item.titleKey)}</h3>
                    <p className="text-gray-300 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 capitalize">{item.category}</p>
                </div>
            </div>
          </NavLink>
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
