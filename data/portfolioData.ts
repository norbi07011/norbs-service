export type PortfolioCategory = 'graphics' | 'photo' | 'websites' | 'video';

export interface PortfolioItem {
  id: number;
  category: PortfolioCategory;
  titleKey: string;
  descriptionKey: string;
  img: string;
  technologies: string[];
}

export const portfolioItems: PortfolioItem[] = [
  { id: 1, category: 'graphics', titleKey: 'portfolio.item1.title', descriptionKey: 'portfolio.item1.description', technologies: ['Adobe Illustrator', 'Figma'], img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop' },
  { id: 2, category: 'photo', titleKey: 'portfolio.item2.title', descriptionKey: 'portfolio.item2.description', technologies: ['Adobe Lightroom', 'Adobe Photoshop'], img: 'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1935&auto=format&fit=crop' },
  { id: 3, category: 'websites', titleKey: 'portfolio.item3.title', descriptionKey: 'portfolio.item3.description', technologies: ['React', 'TypeScript', 'TailwindCSS'], img: 'https://images.unsplash.com/photo-1559028006-44a084d536d2?q=80&w=1974&auto=format&fit=crop' },
  { id: 4, category: 'video', titleKey: 'portfolio.item4.title', descriptionKey: 'portfolio.item4.description', technologies: ['Adobe Premiere Pro', 'After Effects'], img: 'https://images.unsplash.com/photo-1574717024633-5911264904e6?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, category: 'graphics', titleKey: 'portfolio.item5.title', descriptionKey: 'portfolio.item5.description', technologies: ['Figma', 'Procreate'], img: 'https://images.unsplash.com/photo-1611149918283-d5a2b5d40a68?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, category: 'websites', titleKey: 'portfolio.item6.title', descriptionKey: 'portfolio.item6.description', technologies: ['React', 'Next.js', 'Vercel'], img: 'https://images.unsplash.com/photo-1604399723422-62d98980e03e?q=80&w=1974&auto=format&fit=crop' },
  { id: 7, category: 'photo', titleKey: 'portfolio.item7.title', descriptionKey: 'portfolio.item7.description', technologies: ['Capture One', 'Photoshop'], img: 'https://images.unsplash.com/photo-1590242967098-63878b277d34?q=80&w=1932&auto=format&fit=crop' },
  { id: 8, category: 'video', titleKey: 'portfolio.item8.title', descriptionKey: 'portfolio.item8.description', technologies: ['DaVinci Resolve', 'Final Cut Pro'], img: 'https://images.unsplash.com/photo-1533349457322-61azzi8c47f9?q=80&w=1974&auto=format&fit=crop' },
];
