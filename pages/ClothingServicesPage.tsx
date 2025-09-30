import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import ClothingConfigurator from '../components/ui/ClothingConfigurator';
import ClothingGallery from '../components/ui/ClothingGallery';
import ClothingFAQ from '../components/ui/ClothingFAQ';
import ClothingContactForm from '../components/ui/ClothingContactForm';
import Layout from '../components/layout/Layout';

const ClothingServicesPage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('clothing.page_title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {t('clothing.page_subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <span className="bg-white/20 px-4 py-2 rounded-full">🎨 {t('clothing.hero_badges.designs')}</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">🧵 {t('clothing.hero_badges.materials')}</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">🖨️ {t('clothing.hero_badges.technologies')}</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">📦 {t('clothing.hero_badges.service')}</span>
            </div>
          </div>
        </section>

        {/* Konfigurator */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <ClothingConfigurator />
          </div>
        </section>

        {/* Galeria realizacji */}
        <ClothingGallery />

        {/* Proces produkcji */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              {t('clothing.process.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">1. {t('clothing.process.consultation.title')}</h3>
                <p className="text-muted-foreground">
                  {t('clothing.process.consultation.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. {t('clothing.process.design.title')}</h3>
                <p className="text-muted-foreground">
                  {t('clothing.process.design.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧵</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">3. {t('clothing.process.production.title')}</h3>
                <p className="text-muted-foreground">
                  {t('clothing.process.production.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
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

        {/* Technologie nadruku */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              {t('clothing.technologies.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">🖨️</div>
                <h3 className="text-xl font-semibold mb-3">DTG - Direct to Garment</h3>
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

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">🪡</div>
                <h3 className="text-xl font-semibold mb-3">Haft Komputerowy</h3>
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

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">🌈</div>
                <h3 className="text-xl font-semibold mb-3">Sublimacja</h3>
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

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-3">Sitodruk</h3>
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

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-3">Folia Flex & Flock</h3>
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

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold mb-3">Efekty Specjalne</h3>
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

        {/* Cennik */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Cennik Usług Odzieżowych
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pakiet Starter */}
              <div className="bg-background p-8 rounded-xl border border-border hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">Starter</h3>
                <div className="text-3xl font-bold mb-6">od 25 zł<span className="text-lg text-muted-foreground">/szt</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    T-shirty i tank topy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Podstawowe materiały
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    DTG lub vinyl
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Min. 1 sztuka
                  </li>
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors">
                  Zamów teraz
                </button>
              </div>

              {/* Pakiet Professional */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-xl text-white transform scale-105 shadow-2xl">
                <div className="bg-white/20 text-center py-2 px-4 rounded-full text-sm font-semibold mb-4">
                  NAJPOPULARNIEJSZY
                </div>
                <h3 className="text-2xl font-bold mb-4">Professional</h3>
                <div className="text-3xl font-bold mb-6">od 45 zł<span className="text-lg opacity-75">/szt</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    Wszystkie typy ubrań
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    Premium materiały
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    Haft + wszystkie technologie
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-300">✓</span>
                    Projekt graficzny gratis
                  </li>
                </ul>
                <button className="w-full bg-white text-purple-600 hover:bg-gray-100 py-3 px-6 rounded-lg transition-colors font-semibold">
                  Zamów teraz
                </button>
              </div>

              {/* Pakiet Premium */}
              <div className="bg-background p-8 rounded-xl border border-border hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold mb-4 text-gold-600">Premium</h3>
                <div className="text-3xl font-bold mb-6">od 85 zł<span className="text-lg text-muted-foreground">/szt</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Ekskluzywne materiały
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Efekty specjalne
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Pełna personalizacja
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Obsługa VIP
                  </li>
                </ul>
                <button className="w-full bg-gradient-to-r from-gold-500 to-orange-500 hover:from-gold-600 hover:to-orange-600 text-white py-3 px-6 rounded-lg transition-all">
                  Zamów teraz
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <ClothingFAQ />

        {/* Contact Form */}
        <ClothingContactForm />

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-6 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Gotowy na stworzenie swojej kolekcji?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Skontaktuj się z nami i omówmy detale Twojego projektu
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                Bezpłatna konsultacja
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                Zobacz portfolio
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ClothingServicesPage;