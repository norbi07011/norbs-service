export type PortfolioCategory = 'graphics' | 'photo' | 'websites' | 'video';

export interface PortfolioItem {
  id: number;
  category: PortfolioCategory;
  titleKey: string;
  descriptionKey: string;
  img: string;
  technologies: string[];
  title?: string;
  description?: string;
  client?: string;
  year?: number;
}

// Portfolio items for new 3D carousel
export interface Portfolio3DItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  client?: string;
  year?: number;
}

export const portfolio3DItems: Portfolio3DItem[] = [
  {
    id: 1,
    title: "NORBS Premium Website",
    category: "Web Development",
    description: "Nowoczesna strona internetowa z zaawansowanymi animacjami i responsive design. Pełna optymalizacja SEO i szybkie ładowanie.",
    image: "/images/Strony-internetowe.jpg",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    client: "NORBS SERVICE",
    year: 2024
  },
  {
    id: 2,
    title: "Kolekcja Premium Streetwear",
    category: "Fashion Design",
    description: "Projektowanie i produkcja ekskluzywnej kolekcji ubrań streetwear. Autorskie wzory, premium materiały, zaawansowane technologie nadruku.",
    image: "/images/Projektowanie-ubran.jpg",
    technologies: ["DTG Print", "Embroidery", "Screen Print", "Organic Cotton"],
    client: "Fashion Brand",
    year: 2024
  },
  {
    id: 3,
    title: "Kampania Marketingowa",
    category: "Marketing Digital",
    description: "Kompleksowa kampania marketingowa z elementami video, grafikami i strategią social media. Wzrost zaangażowania o 300%.",
    image: "/images/Wideo-marketing.jpg",
    technologies: ["After Effects", "Photoshop", "Facebook Ads", "Analytics"],
    client: "Confidential",
    year: 2024
  },
  {
    id: 4,
    title: "Sesja Fotograficzna",
    category: "Photography",
    description: "Profesjonalna sesja produktowa z postprodukcją. Zdjęcia wykorzystane w kampanii reklamowej i na stronie internetowej.",
    image: "/images/Fotografia.jpg",
    technologies: ["Canon R5", "Lightroom", "Photoshop", "Studio Lighting"],
    client: "Local Business",
    year: 2024
  },
  {
    id: 5,
    title: "Identyfikacja Wizualna",
    category: "Graphic Design",
    description: "Kompletna identyfikacja wizualna marki - logo, wizytówki, materiały reklamowe. Spójny system identyfikacji wizualnej.",
    image: "/images/Projekty-graficzne.jpg",
    technologies: ["Illustrator", "InDesign", "Photoshop", "Brand Strategy"],
    client: "Startup Company",
    year: 2024
  },
  {
    id: 6,
    title: "Uniformy Korporacyjne",
    category: "Corporate Fashion",
    description: "Projekty i produkcja uniformów dla firm. Funkcjonalne, eleganckie, z elementami brandingu. Materiały antyalergiczne.",
    image: "/images/Projektowanie-ubran.jpg",
    technologies: ["Embroidery", "Heat Transfer", "Breathable Fabrics", "Logo Design"],
    client: "Corporate Client",
    year: 2024
  },
  {
    id: 7,
    title: "Motion Graphics Video",
    category: "Video Production",
    description: "Animowany film promocyjny z motion graphics, voice-over i profesjonalnym montażem. Wykorzystany w kampanii reklamowej.",
    image: "/images/Wideo-marketing.jpg",
    technologies: ["After Effects", "Premiere Pro", "Cinema 4D", "Audio Design"],
    client: "Tech Company",
    year: 2024
  },
  {
    id: 8,
    title: "Kolekcja Eco Fashion",
    category: "Sustainable Fashion",
    description: "Ekonogiczna kolekcja ubrań z materiałów recyklingowych. Innowacyjne wzornictwo z dbałością o środowisko.",
    image: "/images/Projektowanie-ubran.jpg",
    technologies: ["Organic Materials", "Eco Printing", "Recycled Fabrics", "Sustainable Design"],
    client: "Eco Brand",
    year: 2024
  }
];

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
