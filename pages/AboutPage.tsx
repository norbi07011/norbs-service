import React, { useRef, useState, useEffect, RefObject } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useOnScreen } from '../hooks/useOnScreen';
import TeamCarousel3D from '../components/ui/TeamCarousel3D';

// --- HELPER & SUB-COMPONENTS ---

const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref as RefObject<Element>, { threshold: 0.1 });
  return (
    <section
      ref={ref}
      className={`transition-all duration-1000 ${className} ${isOnScreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </section>
  );
};

const AnimatedCounter: React.FC<{ target: number; label: string; suffix?: string }> = ({ target, label, suffix = "+" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref as RefObject<Element>);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isOnScreen) {
      let start = 0;
      const end = target;
      if (start === end) return;

      const duration = 2000;
      const incrementTime = (duration / end);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isOnScreen, target]);

  return (
    <div ref={ref} className="text-center p-8 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <p className="text-5xl font-bold text-accent mb-2 font-mono">{count}{suffix}</p>
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg blur-xl -z-10"></div>
      </div>
      <p className="text-muted-foreground font-medium">{label}</p>
    </div>
  );
};

const SocialIcon: React.FC<{ href: string, children: React.ReactNode, label: string }> = ({ href, children, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-muted-foreground hover:text-accent transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-accent/10"
    aria-label={label}
  >
    {children}
  </a>
);

const AccordionItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border/30 last:border-b-0 group">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left flex justify-between items-center py-6 px-4 hover:bg-muted/20 rounded-lg transition-all duration-300"
        aria-expanded={isOpen ? 'true' : 'false'}
        type="button"
      >
        <span className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">{title}</span>
        <span className={`transform transition-all duration-300 text-accent ${isOpen ? 'rotate-180 scale-110' : 'hover:scale-110'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

const ValueCard: React.FC<{ icon: string; title: string; description: string; index: number }> = ({ icon, title, description, index }) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group-hover:border-accent/30">
      <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
      <div className="absolute top-4 right-4 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent text-sm font-bold">
        {index + 1}
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

const AboutPage: React.FC = () => {
  const { t } = useTranslations();
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    { 
      quote: t('about_page.testimonials.0.quote'), 
      author: t('about_page.testimonials.0.author'), 
      company: t('about_page.testimonials.0.company'),
      rating: 5,
      avatar: "https://picsum.photos/100/100?random=301"
    },
    { 
      quote: t('about_page.testimonials.1.quote'), 
      author: t('about_page.testimonials.1.author'), 
      company: t('about_page.testimonials.1.company'),
      rating: 5,
      avatar: "https://picsum.photos/100/100?random=302"
    },
    { 
      quote: "Norbs Service przekroczyło nasze oczekiwania. Profesjonalizm na najwyższym poziomie!", 
      author: "Piotr Nowak", 
      company: "TechStart",
      rating: 5,
      avatar: "https://picsum.photos/100/100?random=303"
    },
  ];
    
  const valuesData = [
    { 
      icon: "🎨", 
      title: t('about_page.values.creativity_title'), 
      description: t('about_page.values.creativity_desc'),
    },
    { 
      icon: "⚡", 
      title: t('about_page.values.speed_title'), 
      description: t('about_page.values.speed_desc'),
    },
    { 
      icon: "💎", 
      title: t('about_page.values.premium_title'), 
      description: t('about_page.values.premium_desc'),
    },
    { 
      icon: "🚀", 
      title: "Innowacja", 
      description: "Wykorzystujemy najnowsze technologie i trendy, aby dostarczać rozwiązania przyszłości.",
    },
    { 
      icon: "🤝", 
      title: "Partnerstwo", 
      description: "Budujemy długotrwałe relacje oparte na zaufaniu i wzajemnym szacunku.",
    },
    { 
      icon: "🎯", 
      title: "Precyzja", 
      description: "Każdy detal ma znaczenie. Dążymy do perfekcji w każdym aspekcie naszej pracy.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="overflow-x-hidden bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Hero Section - Enhanced */}
      <section className="relative h-screen flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 z-5"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://picsum.photos/1920/1080?random=100"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="relative z-20 container mx-auto px-6 max-w-4xl">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight animate-fade-in-up">
              <span className="bg-gradient-to-r from-white via-accent to-primary bg-clip-text text-transparent">
                {t('about_page.hero_title')}
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
              {t('about_page.hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="px-8 py-4 bg-accent hover:bg-accent/80 text-accent-foreground font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25">
                {t('learn_more')}
              </button>
              <button className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white hover:text-foreground font-semibold rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                {t('our_portfolio')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20 space-y-32">

        {/* Mission & Stats Section - Enhanced */}
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Mission */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-3xl blur-2xl"></div>
              <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t('about_page.mission_title')}</h2>
                  </div>
                  <p className="text-xl md:text-2xl font-medium text-accent leading-relaxed">
                    {t('about_page.mission_text')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Jesteśmy zespołem pasjonatów, którzy wierzą, że technologia może zmienić świat. 
                    Każdy projekt traktujemy jako możliwość stworzenia czegoś wyjątkowego.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-8">{t('about_page.stats_title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatedCounter target={300} label={t('about_page.stats.projects')} />
                <AnimatedCounter target={150} label={t('about_page.stats.clients')} />
                <AnimatedCounter target={10} label={t('about_page.stats.experience')} suffix=" lat" />
                <AnimatedCounter target={99} label="Zadowoleni klienci" suffix="%" />
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Values Section - Enhanced Grid */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about_page.values_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('about_page.values.intro')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuesData.map((value, index) => (
              <ValueCard 
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                index={index}
              />
            ))}
          </div>
        </AnimatedSection>
        
        {/* Team Section - New 3D Carousel */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about_page.team_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Poznaj nasz zespół ekspertów, którzy łączą pasję z profesjonalizmem, 
              tworząc rozwiązania najwyższej jakości.
            </p>
          </div>
          <TeamCarousel3D />
        </AnimatedSection>

        {/* Testimonials Section - Enhanced */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about_page.testimonials_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Głosy naszych zadowolonych klientów mówią same za siebie
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12 min-h-[400px] overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`absolute inset-0 p-8 md:p-12 flex flex-col justify-center items-center text-center transition-all duration-700 ease-in-out ${
                    index === testimonialIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="space-y-8">
                    {/* Stars Rating */}
                    <div className="flex justify-center space-x-1 mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl text-muted-foreground italic leading-relaxed max-w-3xl">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Author */}
                    <div className="flex items-center justify-center space-x-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.author} 
                        className="w-16 h-16 rounded-full border-2 border-accent/30 object-cover"
                      />
                      <div className="text-left">
                        <p className="font-bold text-foreground text-lg">{testimonial.author}</p>
                        <p className="text-accent font-medium">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Navigation dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestimonialIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === testimonialIndex ? 'bg-accent scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                    }`}
                    aria-label={`Testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ Section - Enhanced */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about_page.faq_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Najczęściej zadawane pytania i odpowiedzi
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-3xl blur-2xl"></div>
              <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12">
                <div className="space-y-4">
                  <AccordionItem title={t('about_page.faq1_title')}>
                    <p>{t('about_page.faq1_answer')}</p>
                  </AccordionItem>
                  <AccordionItem title={t('about_page.faq2_title')}>
                    <p>{t('about_page.faq2_answer')}</p>
                  </AccordionItem>
                  <AccordionItem title={t('about_page.faq3_title')}>
                    <p>{t('about_page.faq3_answer')}</p>
                  </AccordionItem>
                  <AccordionItem title={t('about_page.faq4_title')}>
                    <p>{t('about_page.faq4_answer')}</p>
                  </AccordionItem>
                  <AccordionItem title="Czy oferujecie wsparcie po realizacji projektu?">
                    <p>Tak, oferujemy kompleksowe wsparcie techniczne przez 12 miesięcy od zakończenia projektu. 
                    Obejmuje to aktualizacje, konserwację i pomoc techniczną.</p>
                  </AccordionItem>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Call to Action Section */}
        <AnimatedSection>
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl p-12 md:p-16 border border-accent/20">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Gotowy na kolejny krok?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Skontaktuj się z nami już dziś i rozpocznij swoją cyfrową transformację 
                  z zespołem ekspertów Norbs Service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="px-10 py-4 bg-accent hover:bg-accent/80 text-accent-foreground font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25">
                    Skontaktuj się z nami
                  </button>
                  <button className="px-10 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold rounded-full transition-all duration-300 hover:scale-105">
                    Zobacz portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
};

export default AboutPage;