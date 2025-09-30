import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const ClothingConfigurator: React.FC = () => {
  const { t } = useTranslations();
  const [selectedClothingType, setSelectedClothingType] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('cotton');
  const [selectedPrint, setSelectedPrint] = useState<string>('screen');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);

  const clothingTypes = [
    { id: 'tshirt', name: 'T-Shirt', icon: '👕', basePrice: 25, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'hoodie', name: 'Bluza z kapturem', icon: '🧥', basePrice: 65, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'polo', name: 'Koszulka Polo', icon: '👔', basePrice: 45, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'tank', name: 'Tank Top', icon: '🎽', basePrice: 20, sizes: ['XS', 'S', 'M', 'L', 'XL'] },
    { id: 'sweater', name: 'Bluza bez kaptura', icon: '🧥', basePrice: 55, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'jacket', name: 'Kurtka', icon: '🧥', basePrice: 120, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'pants', name: 'Spodnie', icon: '👖', basePrice: 60, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    { id: 'cap', name: 'Czapka', icon: '🧢', basePrice: 25, sizes: ['One Size'] }
  ];

  const materials = [
    {
      id: 'cotton',
      name: 'Bawełna Organiczna',
      description: 'Naturalna, oddychająca, przyjemna w dotyku',
      price: 8,
      durability: 90,
      properties: ['Oddychająca', 'Hipoalergiczna', 'Łatwa w pielęgnacji'],
      icon: '🌱'
    },
    {
      id: 'polyester',
      name: 'Poliester 100%',
      description: 'Syntetyczna tkanina, szybkoschnąca',
      price: -3,
      durability: 95,
      properties: ['Szybkoschnąca', 'Odporna na kurczenie', 'Łatwa w praniu'],
      icon: '🧪'
    },
    {
      id: 'blend',
      name: 'Bawełna/Poliester',
      description: 'Mieszanka zapewniająca komfort i trwałość',
      price: 0,
      durability: 92,
      properties: ['Komfortowa', 'Trwała', 'Uniwersalna'],
      icon: '⚖️'
    },
    {
      id: 'modal',
      name: 'Modal Premium',
      description: 'Luksusowa tkanina z włókien bukowych',
      price: 15,
      durability: 85,
      properties: ['Jedwabista', 'Oddychająca', 'Antybakteryjna'],
      icon: '✨'
    },
    {
      id: 'bamboo',
      name: 'Bambus',
      description: 'Ekologiczna, antybakteryjna tkanina',
      price: 12,
      durability: 88,
      properties: ['Antybakteryjna', 'UV Protection', 'Termoregulacja'],
      icon: '🎋'
    },
    {
      id: 'hemp',
      name: 'Konopie',
      description: 'Bardzo trwała, ekologiczna tkanina',
      price: 18,
      durability: 95,
      properties: ['Bardzo trwała', 'Antybakteryjna', 'UV Protection'],
      icon: '🌿'
    },
    {
      id: 'linen',
      name: 'Len',
      description: 'Naturalny, chłodzący, idealny na lato',
      price: 20,
      durability: 80,
      properties: ['Chłodzący', 'Higroskoijny', 'Naturalny'],
      icon: '🌾'
    },
    {
      id: 'merino',
      name: 'Wełna Merino',
      description: 'Premium wełna, termoregulacyjna',
      price: 35,
      durability: 92,
      properties: ['Termoregulacja', 'Antybakteryjna', 'Miękka'],
      icon: '🐑'
    }
  ];

  const printTechnologies = [
    {
      id: 'screen',
      name: 'Sitodruk',
      description: 'Klasyczna metoda, idealna dla większych nakładów',
      price: 5,
      durability: 100,
      colors: '1-6 colors',
      minQuantity: 10,
      icon: '🖼️'
    },
    {
      id: 'vinyl',
      name: 'Termotransfer Winylowy',
      description: 'Trwały, idealny dla napisów i prostych grafik',
      price: 12,
      durability: 90,
      colors: 'Single color',
      minQuantity: 1,
      icon: '📄'
    },
    {
      id: 'embroidery',
      name: 'Haft',
      description: 'Luksusowy, trwały, premium wykończenie',
      price: 20,
      durability: 100,
      colors: 'Multi-color',
      minQuantity: 1,
      icon: '🪡'
    },
    {
      id: 'sublimation',
      name: 'Sublimacja',
      description: 'Pełnokolorowy nadruk na całej powierzchni',
      price: 18,
      durability: 95,
      colors: 'Full color',
      minQuantity: 5,
      icon: '🌈'
    },
    {
      id: 'flex',
      name: 'Folia Flex',
      description: 'Elastyczna folia, idealna na materiały stretch',
      price: 10,
      durability: 85,
      colors: 'Solid colors',
      minQuantity: 1,
      icon: '✨'
    },
    {
      id: 'discharge',
      name: 'Discharge Printing',
      description: 'Miękki nadruk bez folii, naturalny efekt',
      price: 14,
      durability: 95,
      colors: 'Vintage look',
      minQuantity: 25,
      icon: '🎭'
    },
    {
      id: 'puff',
      name: 'Puff Print',
      description: '3D efekt, wypukły nadruk',
      price: 16,
      durability: 88,
      colors: 'Limited colors',
      minQuantity: 10,
      icon: '📈'
    }
  ];

  const selectedMaterialData = materials.find(m => m.id === selectedMaterial);
  const selectedPrintData = printTechnologies.find(p => p.id === selectedPrint);

  const calculateTotalPrice = () => {
    if (!selectedClothingType) return 0;
    
    const basePrice = selectedClothingType.basePrice;
    const materialPrice = selectedMaterialData?.price || 0;
    const printPrice = selectedPrintData?.price || 0;
    
    return (basePrice + materialPrice + printPrice) * quantity;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-card/30 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          {t('clothing.configurator.title')}
        </h2>
        <p className="text-lg text-muted-foreground">
          {t('clothing.configurator.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wybór typu ubrania */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
            <span className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm">
              👕
            </span>
            {t('clothing.configurator.clothing_type')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clothingTypes.map((clothing) => (
              <button
                key={clothing.id}
                onClick={() => setSelectedClothingType(clothing)}
                className={`group relative overflow-hidden p-6 rounded-2xl border transition-all duration-500 transform hover:scale-105 ${
                  selectedClothingType?.id === clothing.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm shadow-lg shadow-blue-500/25'
                    : 'border-border/50 bg-card/30 backdrop-blur-sm hover:border-blue-400/50 hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-cyan-500/5'
                }`}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {/* Content */}
                <div className="relative z-10 text-center space-y-3">
                  <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {clothing.icon}
                  </div>
                  <div className="font-semibold text-sm text-foreground group-hover:text-blue-300 transition-colors">
                    {clothing.name}
                  </div>
                  <div className="text-xs text-muted-foreground group-hover:text-cyan-300 transition-colors">
                    od {clothing.basePrice} zł
                  </div>
                </div>
                
                {/* Selection indicator */}
                {selectedClothingType?.id === clothing.id && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Wybór materiału */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
            <span className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm">
              🧵
            </span>
            {t('clothing.configurator.material')}
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/30">
            {materials.map((material) => (
              <button
                key={material.id}
                onClick={() => setSelectedMaterial(material.id)}
                className={`group w-full p-6 rounded-2xl border transition-all duration-500 text-left relative overflow-hidden ${
                  selectedMaterial === material.id
                    ? 'border-green-500 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm shadow-lg shadow-green-500/25'
                    : 'border-border/50 bg-card/30 backdrop-blur-sm hover:border-green-400/50 hover:bg-gradient-to-br hover:from-green-500/5 hover:to-emerald-500/5'
                }`}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                      {material.icon}
                    </span>
                    <div className="space-y-3">
                      <div className="font-semibold text-foreground group-hover:text-green-300 transition-colors">
                        {material.name}
                      </div>
                      <div className="text-sm text-muted-foreground group-hover:text-emerald-300 transition-colors">
                        {material.description}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {material.properties.map((prop, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 backdrop-blur-sm"
                          >
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      material.price > 0 
                        ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30' 
                        : material.price < 0 
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                        : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {material.price > 0 ? `+${material.price} zł` : material.price < 0 ? `${material.price} zł` : 'Gratis'}
                    </span>
                  </div>
                </div>
                
                {/* Selection indicator */}
                {selectedMaterial === material.id && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Wybór technologii nadruku */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
            <span className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
              🎨
            </span>
            {t('clothing.configurator.print_tech')}
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/30">
            {printTechnologies.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setSelectedPrint(tech.id)}
                className={`group w-full p-6 rounded-2xl border transition-all duration-500 text-left relative overflow-hidden ${
                  selectedPrint === tech.id
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm shadow-lg shadow-purple-500/25'
                    : 'border-border/50 bg-card/30 backdrop-blur-sm hover:border-purple-400/50 hover:bg-gradient-to-br hover:from-purple-500/5 hover:to-pink-500/5'
                }`}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                      {tech.icon}
                    </span>
                    <div className="space-y-3">
                      <div className="font-semibold text-foreground group-hover:text-purple-300 transition-colors">
                        {tech.name}
                      </div>
                      <div className="text-sm text-muted-foreground group-hover:text-pink-300 transition-colors">
                        {tech.description}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-border/30 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${tech.durability}%` }}
                            />
                          </div>
                          <span className="text-xs text-green-400 font-medium">
                            Trwałość: {tech.durability}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30 backdrop-blur-sm">
                            Kolory: {tech.colors}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 px-2 py-1 rounded-full border border-orange-500/30 backdrop-blur-sm">
                            Min. ilość: {tech.minQuantity} szt.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    <span className="px-3 py-1 rounded-full text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                      +{tech.price} zł
                    </span>
                  </div>
                </div>
                
                {/* Selection indicator */}
                {selectedPrint === tech.id && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Podsumowanie i opcje dodatkowe */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Opcje dodatkowe */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <span className="p-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm">
              ⚙️
            </span>
            Opcje Dodatkowe
          </h3>
          
          {/* Rozmiar */}
          <div className="space-y-3">
            <label htmlFor="size-select" className="block text-sm font-semibold text-foreground">
              Rozmiar
            </label>
            <div className="relative">
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-4 border border-border/50 rounded-2xl bg-card/30 backdrop-blur-sm text-foreground appearance-none cursor-pointer focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 hover:border-indigo-400/50"
                aria-label="Wybierz rozmiar"
                title="Wybierz rozmiar"
              >
                {selectedClothingType?.sizes.map((size: string) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Ilość */}
          <div className="space-y-3">
            <label htmlFor="quantity-input" className="block text-sm font-semibold text-foreground">
              Ilość
            </label>
            <input
              id="quantity-input"
              type="number"
              min="1"
              max="1000"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-4 border border-border/50 rounded-2xl bg-card/30 backdrop-blur-sm text-foreground focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 hover:border-indigo-400/50"
              aria-label="Ilość sztuk"
              title="Ilość sztuk"
              placeholder="Wprowadź ilość"
            />
          </div>

          {/* Przycisk zamówienia */}
          <button 
            className="group w-full mt-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-purple-500/25 relative overflow-hidden"
            onClick={() => alert('Funkcja zamówienia w przygotowaniu!')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative z-10 flex items-center justify-center gap-2">
              <span>🛒</span>
              <span>{t('clothing.configurator.order_btn')}</span>
            </div>
          </button>
        </div>

        {/* Podsumowanie */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <span className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm">
              📊
            </span>
            Podsumowanie
          </h3>
          
          <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Produkt:</span>
              <span className="font-semibold text-foreground">{selectedClothingType?.name} ({selectedSize})</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Materiał:</span>
              <span className="font-semibold text-foreground">{selectedMaterialData?.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Nadruk:</span>
              <span className="font-semibold text-foreground">{selectedPrintData?.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="text-muted-foreground">Ilość:</span>
              <span className="font-semibold text-foreground">{quantity} szt.</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-xl font-bold text-foreground">Całkowity koszt:</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {calculateTotalPrice()} zł
              </span>
            </div>
          </div>

          <button className="group w-full p-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-lg shadow-yellow-500/25 hover:shadow-orange-500/25 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative z-10 flex items-center justify-center gap-2">
              <span>🛒</span>
              <span>{t('clothing.configurator.order_now')}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClothingConfigurator;