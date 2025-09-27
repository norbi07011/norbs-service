import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { blogPosts } from '../data/blogData';
import { useTranslations } from '../hooks/useTranslations';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslations();
  const post = blogPosts.find(p => p.id.toString() === id);

  if (!post) {
    return (
        <div className="container mx-auto px-6 py-40 text-center">
            <h1 className="text-4xl font-bold">Post Not Found</h1>
            <NavLink to="/faq-blog" className="mt-8 inline-block text-accent hover:underline">
                &larr; Back to Blog
            </NavLink>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <article className="max-w-4xl mx-auto">
        <NavLink to="/faq-blog" className="mb-8 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back to Blog
        </NavLink>
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight" style={{ textShadow: '0 0 8px hsl(var(--accent))' }}>
            {t(post.titleKey)}
        </h1>
        <div className="flex items-center text-muted-foreground text-sm mb-8">
            <span>By {post.author}</span>
            <span className="mx-2">&bull;</span>
            <span>{post.date}</span>
        </div>
        
        <img src={post.image} alt={t(post.titleKey)} className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-12 border-2 border-border-color shadow-lg" />
        
        <div className="prose prose-invert prose-lg max-w-none text-muted-foreground space-y-6">
            {t(post.contentKey).split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;
