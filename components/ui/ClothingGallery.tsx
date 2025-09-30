import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface ClothingGalleryItem {
  id: string;
  title: string;
  category: string;
  materials: string[];
  printTechnology: string;
  price: string;
  imgSrc: string;
  description: string;
}

const clothingGalleryItems: ClothingGalleryItem[] = [
  {
    id: 'streetwear-01',
    title: 'Premium Streetwear Collection',
    category: 'Streetwear',
    materials: ['Organic Cotton', 'Recycled Polyester'],
    printTechnology: 'DTG + Embroidery',
    price: '89-149 zł',
    imgSrc: '/images/clothing/streetwear-collection.jpg',
    description: 'Ekskluzywna kolekcja streetwear z autorskimi grafikami i najwyższej jakości materiałami.'
  },
  {
    id: 'corporate-01',
    title: 'Corporate Uniforms',
    category: 'Uniformy',
    materials: ['Premium Cotton', 'Performance Blend'],
    printTechnology: 'Embroidery + Screen Print',
    price: '65-120 zł',
    imgSrc: '/images/clothing/corporate-uniforms.jpg',
    description: 'Eleganckie uniformy firmowe z logo haftem komputerowym najwyższej jakości.'
  },
  {
    id: 'eco-fashion-01',
    title: 'Eco Fashion Line',
    category: 'Eco Fashion',
    materials: ['Bamboo Fiber', 'Hemp', 'Organic Cotton'],
    printTechnology: 'Water-based DTG',
    price: '75-159 zł',
    imgSrc: '/images/clothing/eco-fashion.jpg',
    description: 'Kolekcja eco-friendly z materiałów organicznych i biodegradowalnych farb.'
  },
  {
    id: 'sports-01',
    title: 'Sports Performance Wear',
    category: 'Sportswear',
    materials: ['Performance Polyester', 'Moisture-wicking Blend'],
    printTechnology: 'Sublimation',
    price: '55-99 zł',
    imgSrc: '/images/clothing/sports-wear.jpg',
    description: 'Funkcjonalna odzież sportowa z zaawansowanymi technologiami odprowadzania wilgoci.'
  },
  {
    id: 'luxury-01',
    title: 'Luxury Designer Series',
    category: 'Luxury',
    materials: ['Merino Wool', 'Silk Blend', 'Premium Cotton'],
    printTechnology: 'Hand Embroidery + Foil Print',
    price: '199-399 zł',
    imgSrc: '/images/clothing/luxury-series.jpg',
    description: 'Luksusowa seria z ręcznym haftem i złotymi detalami dla wymagających klientów.'
  },
  {
    id: 'casual-01',
    title: 'Casual Everyday Collection',
    category: 'Casual',
    materials: ['Cotton Blend', 'Jersey'],
    printTechnology: 'DTG + Vinyl',
    price: '39-79 zł',
    imgSrc: '/images/clothing/casual-collection.jpg',
    description: 'Wygodna kolekcja na co dzień z miękkimi materiałami i trwałymi nadrukami.'
  }
];

interface ClothingGalleryProps {
  showTitle?: boolean;
}

const ClothingGallery: React.FC<ClothingGalleryProps> = ({ showTitle = true }) => {
  const { t } = useTranslations();
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        {showTitle && (
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t('clothing.gallery.title')}
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clothingGalleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>

                {/* Materials */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-foreground">Materiały:</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.materials.map((material, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-full"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Print Technology */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-1 text-foreground">Technologia:</h4>
                  <span className="text-sm text-blue-600 font-medium">
                    {item.printTechnology}
                  </span>
                </div>

                {/* CTA */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-semibold">
                  Zobacz szczegóły
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4 text-foreground">
            {t('clothing.gallery.cta_title')}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t('clothing.gallery.cta_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              {t('clothing.gallery.configurator_btn')}
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              {t('clothing.gallery.contact_btn')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClothingGallery;