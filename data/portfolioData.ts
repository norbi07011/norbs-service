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
  video?: string;
  externalLink?: string;
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
    title: "Wideo Marketing - Prezentacja Firmy",
    category: "Video Marketing",
    description: "Film korporacyjny prezentujący firmę, jej wartości i ofertę. Profesjonalna produkcja wideo z wywiadami i ujęciami produktowymi.",
    image: "/images/video/Marketing wideo1.mp4",
    technologies: ["DaVinci Resolve", "Final Cut Pro", "Color Grading"],
    client: "NORBS SERVICE",
    year: 2024
  },
  {
    id: 2,
    title: "Wideo Marketing - Reklama Produktu",
    category: "Video Production",
    description: "Profesjonalny film reklamowy produktu z efektami wizualnymi i dynamicznym montażem. Angażujący content marketingowy.",
    image: "/images/video/Marketing wideo.mp4",
    technologies: ["Adobe Premiere Pro", "After Effects", "Cinema 4D"],
    client: "Confidential",
    year: 2024
  },
  {
    id: 3,
    title: "Projektowanie Ubrań - Visualizacja 3D",
    category: "Clothing Design",
    description: "Profesjonalne projektowanie odzieży z wykorzystaniem zaawansowanych narzędzi 3D. Kompleksowa wizualizacja projektu od koncepcji do finalnego produktu.",
    image: "/images/UBRANIA .jpg",
    technologies: ["CLO 3D", "Adobe Illustrator", "Pattern Making"],
    client: "Fashion Brand",
    year: 2024
  },
  {
    id: 4,
    title: "Wideo Marketing - Social Media Content",
    category: "Video Marketing",
    description: "Krótkie, dynamiczne wideo stworzone z myślą o mediach społecznościowych. Optymalizowane pod Instagram, TikTok i Facebook.",
    image: "/images/video/Marketing wideo3.mp4",
    technologies: ["Final Cut Pro", "Motion", "Social Media Optimization"],
    client: "Startup Company",
    year: 2024
  },
  {
    id: 5,
    title: "Wideo Marketing - Produkcja Reklamowa",
    category: "Video Marketing",
    description: "Dynamiczna reklama wideo z profesjonalnym montażem i efektami wizualnymi. Skuteczny content marketingowy.",
    image: "/images/video/Marketing wideo15.mp4",
    technologies: ["Adobe Premiere Pro", "After Effects"],
    client: "NORBS SERVICE",
    year: 2024
  },
  {
    id: 6,
    title: "Wideo Marketing - Kampania Biznesowa",
    category: "Video Marketing",
    description: "Profesjonalny film biznesowy z najwyższą jakością produkcji. Kompleksowa realizacja od koncepcji po postprodukcję.",
    image: "/images/video/Marketing wideo.15.mp4",
    technologies: ["DaVinci Resolve", "Adobe Premiere Pro", "Color Grading"],
    client: "Corporate Client",
    year: 2024
  },
  {
    id: 7,
    title: "Wideo Marketing - Social Media Video",
    category: "Video Marketing",
    description: "Kreatywne wideo zoptymalizowane pod media społecznościowe. Angażująca treść dla Instagram, TikTok i Facebook.",
    image: "/images/video/marketing wideo14.mp4",
    technologies: ["Final Cut Pro", "Motion"],
    client: "Digital Agency",
    year: 2024
  },
  {
    id: 8,
    title: "Wideo Marketing - Kampania Reklamowa",
    category: "Video Marketing",
    description: "Profesjonalna kampania wideo z dynamicznym montażem. Wysokiej jakości produkcja dla mediów społecznościowych i reklam online.",
    image: "/images/video/Marketing wideo.16.mp4",
    technologies: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve"],
    client: "NORBS SERVICE",
    year: 2024
  }
];

export const portfolioItems: PortfolioItem[] = [
  { id: 1, category: 'graphics', titleKey: 'portfolio.item1.title', descriptionKey: 'portfolio.item1.description', technologies: ['Adobe Illustrator', 'Figma'], img: '/images/portwolio zdjecia .jpg' },
  { id: 2, category: 'graphics', titleKey: 'portfolio.item2.title', descriptionKey: 'portfolio.item2.description', technologies: ['Adobe Photoshop', 'Illustrator'], img: '/images/portwolio zdjecia 1.jpg' },
  { id: 3, category: 'graphics', titleKey: 'portfolio.item3.title', descriptionKey: 'portfolio.item3.description', technologies: ['Adobe Illustrator', 'InDesign'], img: '/images/portwolio zdjecia 2.jpg' },
  { id: 4, category: 'graphics', titleKey: 'portfolio.item4.title', descriptionKey: 'portfolio.item4.description', technologies: ['Photoshop', 'Figma'], img: '/images/portwolio zdjecia 3.jpg' },
  { id: 5, category: 'graphics', titleKey: 'portfolio.item5.title', descriptionKey: 'portfolio.item5.description', technologies: ['Adobe Illustrator', 'Photoshop'], img: '/images/portwolio zdjecia 4.jpg' },
  { id: 6, category: 'graphics', titleKey: 'portfolio.item6.title', descriptionKey: 'portfolio.item6.description', technologies: ['Figma', 'Illustrator'], img: '/images/portwolio zdjecia 5.jpg' },
  { id: 7, category: 'graphics', titleKey: 'portfolio.item7.title', descriptionKey: 'portfolio.item7.description', technologies: ['Adobe Photoshop', 'InDesign'], img: '/images/portwolio zdjecia 6.jpg' },
  { id: 8, category: 'graphics', titleKey: 'portfolio.item8.title', descriptionKey: 'portfolio.item8.description', technologies: ['Illustrator', 'Photoshop'], img: '/images/portwolio zdjecia 7.jpg' },
  { id: 9, category: 'graphics', titleKey: 'portfolio.item9.title', descriptionKey: 'portfolio.item9.description', technologies: ['Adobe Illustrator', 'Figma'], img: '/images/portwolio zdjecia 8.jpg' },
  { id: 10, category: 'graphics', titleKey: 'portfolio.item10.title', descriptionKey: 'portfolio.item10.description', technologies: ['Photoshop', 'Illustrator'], img: '/images/portwolio zdjecia 9.jpg' },
  { id: 11, category: 'graphics', titleKey: 'portfolio.item11.title', descriptionKey: 'portfolio.item11.description', technologies: ['Adobe Illustrator', 'InDesign'], img: '/images/portwolio zdjecia 10.jpg' },
  { id: 12, category: 'graphics', titleKey: 'portfolio.item12.title', descriptionKey: 'portfolio.item12.description', technologies: ['Figma', 'Photoshop'], img: '/images/portwolio zdjecia 11.jpg' },
  { id: 13, category: 'graphics', titleKey: 'portfolio.item13.title', descriptionKey: 'portfolio.item13.description', technologies: ['Adobe Illustrator', 'Photoshop'], img: '/images/portwolio zdjecia 12.jpg' },
  { id: 14, category: 'graphics', titleKey: 'portfolio.item14.title', descriptionKey: 'portfolio.item14.description', technologies: ['Illustrator', 'InDesign'], img: '/images/portwolio zdjecia 13.jpg' },
  { id: 15, category: 'graphics', titleKey: 'portfolio.item15.title', descriptionKey: 'portfolio.item15.description', technologies: ['Adobe Photoshop', 'Figma'], img: '/images/portwolio zdjecia 14.jpg' },
  { id: 16, category: 'graphics', titleKey: 'portfolio.item16.title', descriptionKey: 'portfolio.item16.description', technologies: ['Figma', 'Procreate'], img: '/images/portwolio zdjecia 15.jpg' },
  { id: 17, category: 'photo', titleKey: 'portfolio.item17.title', descriptionKey: 'portfolio.item17.description', technologies: ['Canon EOS R5', 'Adobe Lightroom'], img: '/images/Fotografia.jpg', video: '/images/video/fotografie1.mp4' },
  { id: 18, category: 'websites', titleKey: 'portfolio.item18.title', descriptionKey: 'portfolio.item18.description', technologies: ['React', 'TypeScript', 'TailwindCSS'], img: '/images/Party Accessoires Verhuur.png', externalLink: 'https://partyaccessoiresverhuur.com/' },
  { id: 19, category: 'video', titleKey: 'portfolio.item19.title', descriptionKey: 'portfolio.item19.description', technologies: ['Adobe Premiere Pro', 'After Effects'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo.mp4' },
  { id: 20, category: 'websites', titleKey: 'portfolio.item20.title', descriptionKey: 'portfolio.item20.description', technologies: ['React', 'Vite', 'Netlify'], img: '/images/HUT SERVICE.png', externalLink: 'https://tangerine-blancmange-5e1286.netlify.app/' },
  { id: 21, category: 'photo', titleKey: 'portfolio.item21.title', descriptionKey: 'portfolio.item21.description', technologies: ['Sony A7III', 'Capture One'], img: '/images/Fotografia.jpg', video: '/images/video/fotografie 2.mp4' },
  { id: 22, category: 'video', titleKey: 'portfolio.item22.title', descriptionKey: 'portfolio.item22.description', technologies: ['DaVinci Resolve', 'Final Cut Pro'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo1.mp4' },
  { id: 23, category: 'video', titleKey: 'portfolio.item23.title', descriptionKey: 'portfolio.item23.description', technologies: ['Adobe Premiere Pro', 'After Effects'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo2.mp4' },
  { id: 24, category: 'video', titleKey: 'portfolio.item24.title', descriptionKey: 'portfolio.item24.description', technologies: ['Final Cut Pro', 'Motion'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo3.mp4' },
  { id: 25, category: 'video', titleKey: 'portfolio.item25.title', descriptionKey: 'portfolio.item25.description', technologies: ['DaVinci Resolve', 'Fusion'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo4.mp4' },
  { id: 26, category: 'video', titleKey: 'portfolio.item26.title', descriptionKey: 'portfolio.item26.description', technologies: ['Adobe Premiere Pro', 'Audition'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo5.mp4' },
  { id: 27, category: 'video', titleKey: 'portfolio.item27.title', descriptionKey: 'portfolio.item27.description', technologies: ['After Effects', 'Cinema 4D'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo6.mp4' },
  { id: 28, category: 'video', titleKey: 'portfolio.item28.title', descriptionKey: 'portfolio.item28.description', technologies: ['Final Cut Pro', 'Compressor'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo7.mp4' },
  { id: 29, category: 'video', titleKey: 'portfolio.item29.title', descriptionKey: 'portfolio.item29.description', technologies: ['Adobe Premiere Pro', 'After Effects'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo8.mp4' },
  { id: 30, category: 'photo', titleKey: 'portfolio.item30.title', descriptionKey: 'portfolio.item30.description', technologies: ['Nikon Z9', 'Adobe Photoshop'], img: '/images/Fotografia.jpg', video: '/images/video/fotogracie .mp4' },
  { id: 31, category: 'video', titleKey: 'portfolio.item31.title', descriptionKey: 'portfolio.item31.description', technologies: ['Adobe Premiere Pro', 'After Effects'], img: '/images/Wideo-marketing.jpg', video: '/images/video/marketing wideo9.mp4' },
  { id: 32, category: 'video', titleKey: 'portfolio.item32.title', descriptionKey: 'portfolio.item32.description', technologies: ['DaVinci Resolve', 'Fusion'], img: '/images/Wideo-marketing.jpg', video: '/images/video/marketing wideo10.mp4' },
  { id: 33, category: 'video', titleKey: 'portfolio.item33.title', descriptionKey: 'portfolio.item33.description', technologies: ['Final Cut Pro', 'Motion'], img: '/images/Wideo-marketing.jpg', video: '/images/video/marketing wideo11.mp4' },
  { id: 34, category: 'video', titleKey: 'portfolio.item34.title', descriptionKey: 'portfolio.item34.description', technologies: ['Adobe Premiere Pro', 'Audition'], img: '/images/Wideo-marketing.jpg', video: '/images/video/marketing wideo12.mp4' },
  { id: 35, category: 'video', titleKey: 'portfolio.item35.title', descriptionKey: 'portfolio.item35.description', technologies: ['After Effects', 'Cinema 4D'], img: '/images/Wideo-marketing.jpg', video: '/images/video/marketing wideo13.mp4' },
  { id: 36, category: 'video', titleKey: 'portfolio.item36.title', descriptionKey: 'portfolio.item36.description', technologies: ['DaVinci Resolve', 'Color Grading'], img: '/images/Wideo-marketing.jpg', video: '/images/video/marketing wideo14.mp4' },
  { id: 37, category: 'video', titleKey: 'portfolio.item37.title', descriptionKey: 'portfolio.item37.description', technologies: ['Adobe Premiere Pro', 'After Effects'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo15.mp4' },
  { id: 38, category: 'video', titleKey: 'portfolio.item38.title', descriptionKey: 'portfolio.item38.description', technologies: ['DaVinci Resolve', 'Adobe Premiere Pro'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo.15.mp4' },
  { id: 39, category: 'video', titleKey: 'portfolio.item39.title', descriptionKey: 'portfolio.item39.description', technologies: ['Final Cut Pro', 'Motion'], img: '/images/Wideo-marketing.jpg', video: '/images/video/Marketing wideo.16.mp4' },
  { id: 40, category: 'websites', titleKey: 'portfolio.item40.title', descriptionKey: 'portfolio.item40.description', technologies: ['React', 'TypeScript', 'Netlify'], img: '/images/KAJFASZ Trener Personalny.png', externalLink: 'https://celebrated-haupia-8bbbb6.netlify.app/' },
  { id: 41, category: 'websites', titleKey: 'portfolio.item41.title', descriptionKey: 'portfolio.item41.description', technologies: ['React', 'React Router', 'Netlify'], img: '/images/Scootershop MG.png', externalLink: 'https://amazing-flan-607013.netlify.app/#/' },
  { id: 42, category: 'websites', titleKey: 'portfolio.item42.title', descriptionKey: 'portfolio.item42.description', technologies: ['React', 'React Router', 'Netlify'], img: '/images/TRENER PERSONALNY PATRYK MMA.png', externalLink: 'https://precious-buttercream-c62641.netlify.app/#/' },
  { id: 43, category: 'websites', titleKey: 'portfolio.item43.title', descriptionKey: 'portfolio.item43.description', technologies: ['React', 'TypeScript', 'Netlify'], img: '/images/RESTAURACJA LENIWA BABA.png', externalLink: 'https://silly-mandazi-938c89.netlify.app/' },
];
