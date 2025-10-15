import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { portfolioItems } from '../data/portfolioData';
import { useTranslations } from '../hooks/useTranslations';

const PortfolioDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslations();
  const item = portfolioItems.find(p => p.id.toString() === id);

  if (!item) {
    return (
        <div className="container mx-auto px-6 py-40 text-center">
            <h1 className="text-4xl font-bold">Project Not Found</h1>
            <NavLink to="/portfolio" className="mt-8 inline-block text-accent hover:underline">
                &larr; Back to Portfolio
            </NavLink>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
            <NavLink to="/portfolio" className="mb-8 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                Back to Portfolio
            </NavLink>
            
            <div className="uiverse-card p-0 overflow-hidden">
                <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                <div className="uiverse-card-content relative z-10 w-full text-left overflow-hidden rounded-[1.8rem]">
                    {item.video ? (
                        <video 
                            controls 
                            className="w-full h-auto object-contain bg-black rounded-t-[1.8rem]"
                        >
                            <source src={item.video} type="video/mp4" />
                            Twoja przeglądarka nie obsługuje odtwarzania wideo.
                        </video>
                    ) : (
                        <img src={item.img} alt={t(item.titleKey)} className="w-full h-auto object-contain rounded-t-[1.8rem]" />
                    )}
                    {/* Usunięto opisy i technologie - tylko media */}
                </div>
            </div>

            <div className="text-center mt-20">
                <NavLink to="/contact" className="mt-8 inline-block bg-gold text-brand-dark font-bold py-3 px-8 rounded-full text-lg hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_hsl(var(--gold-accent)/0.5)]">
                    {t('portfolio.cta')}
                </NavLink>
            </div>
        </div>
    </div>
  );
};

export default PortfolioDetailPage;
