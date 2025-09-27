import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import AIBlogGenerator from '../components/ui/AIBlogGenerator';
import { blogPosts } from '../data/blogData';

const AccordionItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border-color">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left flex justify-between items-center py-5 px-2"
      >
        <span className="text-lg font-semibold text-foreground">{title}</span>
        <span className={`transform transition-transform duration-300 text-foreground ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-5 bg-secondary text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
};

const BlogCard: React.FC<{ post: typeof blogPosts[0] }> = ({ post }) => {
  const { t } = useTranslations();
  return (
    <div className="uiverse-card p-0 overflow-hidden flex flex-col">
      <div className="uiverse-card-circles">
          <div></div><div></div><div></div>
      </div>
      <div className="uiverse-card-content relative z-10 w-full h-full flex flex-col p-0 text-left">
          <img src={post.image} alt={t(post.titleKey)} className="w-full h-48 object-cover" />
          <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-foreground">{t(post.titleKey)}</h3>
              <p className="text-muted-foreground mb-4 flex-grow">{t(post.excerptKey)}</p>
              <NavLink to={`/blog/${post.id}`} className="font-semibold text-accent hover:underline self-start mt-auto">
                {t('faq_blog_page.blog_read_more')}
              </NavLink>
          </div>
      </div>
    </div>
  );
};

const FaqBlogPage: React.FC = () => {
  const { t } = useTranslations();
  
  return (
    <div className="container mx-auto px-6 py-20 space-y-20">
      <section>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-foreground" style={{ textShadow: '0 0 8px hsl(var(--accent))' }}>
          {t('faq_blog_page.faq_title')}
        </h1>
        <div className="max-w-3xl mx-auto">
          <AccordionItem title={t('faq_blog_page.faq1_title')}>
            <p>{t('faq_blog_page.faq1_answer')}</p>
          </AccordionItem>
          <AccordionItem title={t('faq_blog_page.faq2_title')}>
            <p>{t('faq_blog_page.faq2_answer')}</p>
          </AccordionItem>
          <AccordionItem title={t('faq_blog_page.faq3_title')}>
            <p>{t('faq_blog_page.faq3_answer')}</p>
          </AccordionItem>
          <AccordionItem title={t('faq_blog_page.faq4_title')}>
            <p>{t('faq_blog_page.faq4_answer')}</p>
          </AccordionItem>
        </div>
      </section>

      <AIBlogGenerator />

      <section>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-foreground" style={{ textShadow: '0 0 8px hsl(var(--gold-accent))' }}>
          {t('faq_blog_page.blog_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default FaqBlogPage;
