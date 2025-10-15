import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
// import ClothingConfigurator from '../components/ui/ClothingConfigurator';
import ClothingGallery from '../components/ui/ClothingGallery';
import ClothingFAQ from '../components/ui/ClothingFAQ';
import ClothingContactForm from '../components/ui/ClothingContactForm';
import Layout from '../components/layout/Layout';
import MinimalLogoCard from '../components/ui/MinimalLogoCard';

const ClothingServicesPage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-float animation-delay-300"></div>
          </div>
          
          <div className="relative container mx-auto px-6 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
              {t('clothing.page_title')}
            </h1>
            
            {/* Info o starcie projektu - GŁÓWNA INFORMACJA */}
            <div className="max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <div className="text-7xl mb-4 animate-bounce-slow">👕</div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {t('clothing.launch_announcement.title')}
                </h2>
                <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
                  {t('clothing.launch_announcement.description')}
                </p>
                <div className="inline-block bg-white/20 px-6 py-3 rounded-full animate-pulse-slow">
                  <span className="text-base font-semibold">🚀 {t('clothing.launch_announcement.badge')}</span>
                </div>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 animate-fade-in-up animation-delay-400">
              {t('clothing.page_subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg animate-fade-in-up animation-delay-500">
              <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110">🎨 {t('clothing.hero_badges.designs')}</span>
              <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110">🧵 {t('clothing.hero_badges.materials')}</span>
              <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110">📦 {t('clothing.hero_badges.service')}</span>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        {/* Konfigurator - ukryty, będzie dostępny wkrótce */}
        {/* <section className="py-16">
          <div className="container mx-auto px-6">
            <ClothingConfigurator />
          </div>
        </section> */}

        {/* Galeria realizacji */}
        <div className="animate-fade-in-up">
          <ClothingGallery />
        </div>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8"></div>

        {/* Proces produkcji */}
        <section className="py-16 bg-card transition-all duration-500 hover:bg-card/80">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-foreground">
              {t('clothing.process.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">1. {t('clothing.process.consultation.title')}</h3>
                <p className="text-muted-foreground">
                  {t('clothing.process.consultation.description')}
                </p>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl group-hover:shadow-green-500/50 transition-all duration-300">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. {t('clothing.process.design.title')}</h3>
                <p className="text-muted-foreground">
                  {t('clothing.process.design.description')}
                </p>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300">
                  <span className="text-3xl">🧵</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">3. {t('clothing.process.production.title')}</h3>
                <p className="text-muted-foreground">
                  {t('clothing.process.production.description')}
                </p>
              </div>
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl group-hover:shadow-orange-500/50 transition-all duration-300">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">4. {t('clothing.process.delivery.title')}</h3>
                <p className="text-muted-foreground">
                  {t('clothing.process.delivery.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8"></div>

        {/* Technologie nadruku */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
              {t('clothing.technologies.title')}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
              Wykorzystujemy najnowocześniejsze metody nadruku, aby zapewnić najwyższą jakość i trwałość
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-2xl hover:border-accent/50 transition-all duration-500 group hover:transform hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🖨️</div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">DTG - Direct to Garment</h3>
                <p className="text-muted-foreground mb-4">
                  Najnowocześniejsza technologia cyfrowego nadruku bezpośrednio na tkaninę. 
                  Nieograniczona paleta kolorów i najwyższa jakość detali.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Unlimited colors</li>
                  <li>✅ Fotorealistyczne detale</li>
                  <li>✅ Miękki dotyk</li>
                  <li>✅ Ekologiczne farby</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-2xl hover:border-accent/50 transition-all duration-500 group hover:transform hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🪡</div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">Haft Komputerowy</h3>
                <p className="text-muted-foreground mb-4">
                  Tradycyjna, luksusowa metoda zdobienia ubrań. Idealna dla logo firmowych, 
                  monogramów i eleganckich wzorów.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Premium wygląd</li>
                  <li>✅ Maksymalna trwałość</li>
                  <li>✅ Efekt 3D</li>
                  <li>✅ Reprezentacyjny charakter</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-2xl hover:border-accent/50 transition-all duration-500 group hover:transform hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌈</div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">Sublimacja</h3>
                <p className="text-muted-foreground mb-4">
                  Pełnokolorowy nadruk na całej powierzchni ubrania. Idealna dla wzorów 
                  all-over i sportowych koszulek.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Nadruk na całej powierzchni</li>
                  <li>✅ Żywe kolory</li>
                  <li>✅ Odporność na pranie</li>
                  <li>✅ Idealna dla poliestru</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-2xl hover:border-accent/50 transition-all duration-500 group hover:transform hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎨</div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">Sitodruk</h3>
                <p className="text-muted-foreground mb-4">
                  Klasyczna metoda idealna dla większych nakładów. Wyjątkowa trwałość 
                  i intensywność kolorów.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Optymalna dla dużych nakładów</li>
                  <li>✅ Najwyższa trwałość</li>
                  <li>✅ Intensywne kolory</li>
                  <li>✅ Efekty specjalne</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-2xl hover:border-accent/50 transition-all duration-500 group hover:transform hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">✨</div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">Folia Flex & Flock</h3>
                <p className="text-muted-foreground mb-4">
                  Elastyczne folie idealne dla materiałów stretch i projektów z napisami. 
                  Dostępne w wersji gładkiej i aksamitnej.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Elastyczność</li>
                  <li>✅ Różne faktury</li>
                  <li>✅ Metaliczne efekty</li>
                  <li>✅ Glow in the dark</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-2xl hover:border-accent/50 transition-all duration-500 group hover:transform hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎭</div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">Efekty Specjalne</h3>
                <p className="text-muted-foreground mb-4">
                  Puff print (3D), discharge, foil print, glow in the dark i inne 
                  zaawansowane techniki dla wyjątkowych efektów.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ Efekt 3D (Puff)</li>
                  <li>✅ Złote/srebrne folie</li>
                  <li>✅ Świecenie w ciemności</li>
                  <li>✅ Termo-chromowe farby</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8"></div>

        {/* FAQ */}
        <ClothingFAQ />

        {/* Contact Form */}
        <ClothingContactForm />

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-6 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {t('clothing.cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('clothing.cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <NavLink 
                to="/contact" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg inline-block"
              >
                {t('clothing.cta.consultation_btn')}
              </NavLink>
              <NavLink 
                to="/portfolio" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 inline-block"
              >
                {t('clothing.cta.portfolio_btn')}
              </NavLink>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ClothingServicesPage;