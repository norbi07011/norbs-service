import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface FAQItem {
  question: string;
  answer: string;
}

const clothingFAQData: FAQItem[] = [
  {
    question: "Jaki jest minimalny nakład zamówienia?",
    answer: "Nie mamy minimalnego nakładu! Produkujemy już od 1 sztuki. Dla większych nakładów (powyżej 50 sztuk) oferujemy atrakcyjne rabaty ilościowe."
  },
  {
    question: "Jak długo trwa realizacja zamówienia?",
    answer: "Standardowy czas realizacji to 5-10 dni roboczych od zatwierdzenia projektu. Dla pilnych zamówień oferujemy ekspresową realizację w 2-3 dni za dodatkową opłatą."
  },
  {
    question: "Czy mogę dostarczyć własny projekt graficzny?",
    answer: "Tak! Przyjmujemy projekty w formatach AI, EPS, PDF, PNG (min. 300 DPI). Jeśli nie masz gotowego projektu, nasi graficy stworzą go dla Ciebie."
  },
  {
    question: "Jakie materiały oferujecie?",
    answer: "Oferujemy szeroką gamę materiałów: bawełna organiczna, poliester, mieszanki performance, bambus, len, merino wool. Wszystkie materiały są certyfikowane i wysokiej jakości."
  },
  {
    question: "Czy robicie próbki przed produkcją?",
    answer: "Tak! Dla zamówień powyżej 20 sztuk wykonujemy bezpłatną próbkę. Dla mniejszych zamówień koszt próbki to 50 zł, którą odliczamy przy finalizacji zamówienia."
  },
  {
    question: "Jakie technologie nadruku stosujecie?",
    answer: "Używamy najnowocześniejszych technologii: DTG (Direct to Garment), sitodruk, haft komputerowy, sublimacja, folia flex/flock, oraz efekty specjalne jak puff print czy foil print."
  },
  {
    question: "Czy oferujecie dostawę?",
    answer: "Tak! Bezpłatna dostawa dla zamówień powyżej 200 zł. Współpracujemy z DPD, UPS i Pocztą Polską. Możliwy również odbiór osobisty z naszego studia."
  },
  {
    question: "Jak wygląda proces zamawiania?",
    answer: "1) Konsultacja i wybór materiałów 2) Projekt graficzny i wizualizacja 3) Zatwierdzenie i wpłata zaliczki 4) Produkcja 5) Kontrola jakości i wysyłka"
  },
  {
    question: "Czy oferujecie rabaty dla firm?",
    answer: "Tak! Dla stałych klientów biznesowych oferujemy specjalne ceny, wydłużone terminy płatności oraz dedykowanego opiekuna konta."
  },
  {
    question: "Co w przypadku reklamacji?",
    answer: "Gwarantujemy najwyższą jakość. W razie problemów z produktem, skontaktuj się z nami w ciągu 14 dni - bezpłatnie naprawimy lub wymienimy produkt."
  }
];

interface ClothingFAQProps {
  showTitle?: boolean;
}

const ClothingFAQ: React.FC<ClothingFAQProps> = ({ showTitle = true }) => {
  const { t } = useTranslations();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-6">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              {t('clothing.faq.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('clothing.faq.subtitle')}
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clothingFAQData.map((item, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <button
                  className="w-full p-6 text-left hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground pr-4">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0">
                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-transform ${
                          openItems.includes(index) ? 'rotate-180' : ''
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-border">
            <h3 className="text-xl font-bold mb-3 text-foreground">
              {t('clothing.faq.contact_title')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('clothing.faq.contact_subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                📞 Zadzwoń: +31 6 123 456 789
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                💬 WhatsApp
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                ✉️ E-mail
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClothingFAQ;