export interface BlogPost {
  id: number;
  titleKey: string;
  excerptKey: string;
  contentKey: string;
  image: string;
  author: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
    { 
        id: 1, 
        titleKey: 'faq_blog_page.blog1_title', 
        excerptKey: 'faq_blog_page.blog1_excerpt', 
        contentKey: 'blog_posts.post1.content', 
        image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop', 
        author: 'Norbert', 
        date: '2025-05-20' 
    },
    { 
        id: 2, 
        titleKey: 'faq_blog_page.blog2_title', 
        excerptKey: 'faq_blog_page.blog2_excerpt', 
        contentKey: 'blog_posts.post2.content', 
        image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=2070&auto=format&fit=crop', 
        author: 'Ewelina', 
        date: '2025-05-15' 
    },
    { 
        id: 3, 
        titleKey: 'faq_blog_page.blog3_title', 
        excerptKey: 'faq_blog_page.blog3_excerpt', 
        contentKey: 'blog_posts.post3.content', 
        image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop', 
        author: 'Norbert', 
        date: '2025-05-10' 
    },
]
