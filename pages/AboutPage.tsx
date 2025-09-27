import React, { useRef, useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useOnScreen } from '../hooks/useOnScreen';

// --- HELPER & SUB-COMPONENTS ---

const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref, { threshold: 0.1 });
  return (
    <section
      ref={ref}
      className={`transition-all duration-1000 ${className} ${isOnScreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </section>
  );
};

const AnimatedCounter: React.FC<{ target: number; label: string }> = ({ target, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref);
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
    <div ref={ref} className="text-center p-6">
      <p className="text-5xl font-bold text-accent" style={{ textShadow: '0 0 10px hsl(var(--accent))' }}>{count}+</p>
      <p className="text-muted-foreground mt-2">{label}</p>
    </div>
  );
};

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors duration-300">
        {children}
    </a>
);

const AccordionItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border-color last:border-b-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left flex justify-between items-center py-5 px-2"
      >
        <span className="text-lg font-semibold text-foreground">{title}</span>
        <span className={`transform transition-transform duration-300 text-foreground ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-5 pt-0 text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const AboutPage: React.FC = () => {
    const { t } = useTranslations();
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    const testimonials = [
        { quote: t('about_page.testimonials.0.quote'), author: t('about_page.testimonials.0.author'), company: t('about_page.testimonials.0.company') },
        { quote: t('about_page.testimonials.1.quote'), author: t('about_page.testimonials.1.author'), company: t('about_page.testimonials.1.company') },
    ];
    
    const valuesData = [
      { 
          icon: "✨", 
          title: t('about_page.values.creativity_title'), 
          description: t('about_page.values.creativity_desc'),
      },
      { 
          icon: "🚀", 
          title: t('about_page.values.speed_title'), 
          description: t('about_page.values.speed_desc'),
      },
      { 
          icon: "💎", 
          title: t('about_page.values.premium_title'), 
          description: t('about_page.values.premium_desc'),
      },
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setTestimonialIndex(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }, [testimonials.length]);


  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center -mt-20">
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
         <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://picsum.photos/1920/1080?random=100"
        >
          {/* Using a placeholder as actual video files can't be included */}
        </video>
        <div className="relative z-20 container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 animate-glitch" style={{ textShadow: '0 0 8px hsl(var(--accent)), 0 0 12px hsl(var(--gold-accent))'}}>
            {t('about_page.hero_title')}
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            {t('about_page.hero_subtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20 space-y-28">

        {/* Mission & Stats Section */}
        <AnimatedSection>
          <div className="uiverse-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
            <div className="uiverse-card-content relative z-10 w-full text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4 text-foreground">{t('about_page.mission_title')}</h2>
              <p className="text-2xl font-semibold italic text-gold">
                {t('about_page.mission_text')}
              </p>
            </div>
             <div className="uiverse-card-content relative z-10 w-full border-t lg:border-t-0 lg:border-l border-border-color pt-8 lg:pt-0 lg:pl-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-foreground">{t('about_page.stats_title')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <AnimatedCounter target={300} label={t('about_page.stats.projects')} />
                    <AnimatedCounter target={150} label={t('about_page.stats.clients')} />
                    <AnimatedCounter target={10} label={t('about_page.stats.experience')} />
                </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Values Carousel Section */}
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">{t('about_page.values_title')}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{t('about_page.values.intro')}</p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div className="scrolling-carousel">
              {[...valuesData, ...valuesData, ...valuesData, ...valuesData].map((value, index) => (
                <div key={index} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 p-4 [perspective:1000px]">
                   <div className="card-3d w-full h-80">
                      <div className="uiverse-card w-full h-full p-6">
                        <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                        <div className="card-3d-content w-full h-full flex flex-col items-center justify-center text-center">
                          <div className="text-5xl mb-4">{value.icon}</div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        
        {/* Team Section */}
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t('about_page.team_title')}</h2>
          <div className="flex justify-center flex-wrap gap-12">
            {/* Team Member 1 */}
            <div className="uiverse-card justify-center items-center w-full max-w-sm">
              <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
              <div className="uiverse-card-content relative z-10 text-center">
                <img src="https://picsum.photos/200/200?random=5" alt={t('about_page.team.member1_name')} className="w-40 h-40 rounded-full mx-auto border-4 border-muted group-hover:border-accent transition-colors duration-300 transform group-hover:scale-105 mb-4" />
                <h3 className="mt-4 text-xl font-bold text-foreground">{t('about_page.team.member1_name')}</h3>
                <p className="text-muted-foreground mb-4">{t('about_page.team.member1_role')}</p>
                <div className="flex justify-center space-x-4">
                    <SocialIcon href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </SocialIcon>
                     <SocialIcon href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </SocialIcon>
                </div>
              </div>
            </div>
             {/* Team Member 2 */}
            <div className="uiverse-card justify-center items-center w-full max-w-sm">
              <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
              <div className="uiverse-card-content relative z-10 text-center">
                <img src="https://picsum.photos/200/200?random=6" alt={t('about_page.team.member2_name')} className="w-40 h-40 rounded-full mx-auto border-4 border-muted group-hover:border-accent transition-colors duration-300 transform group-hover:scale-105 mb-4" />
                <h3 className="mt-4 text-xl font-bold text-foreground">{t('about_page.team.member2_name')}</h3>
                <p className="text-muted-foreground mb-4">{t('about_page.team.member2_role')}</p>
                <div className="flex justify-center space-x-4">
                    <SocialIcon href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </SocialIcon>
                     <SocialIcon href="#">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </SocialIcon>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t('about_page.testimonials_title')}</h2>
          <div className="uiverse-card relative max-w-3xl mx-auto min-h-[250px] overflow-hidden justify-center items-center">
            <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
            {testimonials.map((testimonial, index) => (
                <div key={index} className={`uiverse-card-content relative z-10 transition-opacity duration-700 ease-in-out absolute inset-0 p-8 flex flex-col justify-center items-center ${index === testimonialIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="italic text-muted-foreground text-lg text-center">"{testimonial.quote}"</p>
                    <div className="flex items-center mt-6">
                        <img src={`https://picsum.photos/100/100?random=${30 + index}`} alt={testimonial.author} className="w-12 h-12 rounded-full mr-4"/>
                        <div>
                            <p className="font-bold text-foreground">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t('about_page.faq_title')}</h2>
            <div className="uiverse-card max-w-4xl mx-auto p-4 sm:p-8">
                <div className="uiverse-card-circles"><div></div><div></div><div></div></div>
                <div className="uiverse-card-content relative z-10 w-full">
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
                </div>
            </div>
        </AnimatedSection>

      </div>
    </div>
  );
};

export default AboutPage;