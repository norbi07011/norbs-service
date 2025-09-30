import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';

interface ClothingConfig {
  type: string;
  material: string;
  printTechnology: string;
  size: string;
  color: string;
  quantity: number;
  additionalOptions: {
    customDesign: boolean;
    rush: boolean;
    packaging: boolean;
  };
}

const ClothingConfigurator: React.FC = () => {
  const { t } = useTranslations();
  const [config, setConfig] = useState<ClothingConfig>({
    type: '',
    material: '',
    printTechnology: '',
    size: '',
    color: '',
    quantity: 1,
    additionalOptions: {
      customDesign: false,
      rush: false,
      packaging: false
    }
  });

  const clothingTypes = [
    { id: 'streetwear', icon: '👕', name: 'Streetwear', desc: 'Modne ubrania miejskie' },
    { id: 'corporate', icon: '👔', name: 'Corporate', desc: 'Uniformy firmowe' },
    { id: 'eco', icon: '🌿', name: 'Eco Fashion', desc: 'Ekologiczna moda' },
    { id: 'sports', icon: '🏃', name: 'Sports Wear', desc: 'Odzież sportowa' },
    { id: 'luxury', icon: '💎', name: 'Luxury', desc: 'Luksusowa kolekcja' },
    { id: 'casual', icon: '👕', name: 'Casual', desc: 'Codzienne ubrania' }
  ];

  const materials = [
    { id: 'cotton', name: 'Bawełna organiczna', quality: 95 },
    { id: 'polyester', name: 'Polyester premium', quality: 85 },
    { id: 'blend', name: 'Mieszanka bawełna/poly', quality: 90 },
    { id: 'bamboo', name: 'Włókno bambusowe', quality: 92 }
  ];

  const printTechnologies = [
    { 
      id: 'dtg', 
      name: 'DTG Print', 
      desc: 'Direct to Garment',
      durability: 88,
      quality: 'Ultra HD',
      icon: '🖨️'
    },
    { 
      id: 'embroidery', 
      name: 'Embroidery', 
      desc: 'Hafty komputerowe',
      durability: 98,
      quality: 'Premium',
      icon: '🧵'
    },
    { 
      id: 'screen', 
      name: 'Screen Print', 
      desc: 'Sitodruk tradycyjny',
      durability: 95,
      quality: 'High',
      icon: '🎨'
    },
    { 
      id: 'vinyl', 
      name: 'Vinyl Cut', 
      desc: 'Folia termotransferowa',
      durability: 85,
      quality: 'Standard',
      icon: '✂️'
    }
  ];

  const handleConfigChange = (section: keyof ClothingConfig, value: any) => {
    setConfig(prev => ({ ...prev, [section]: value }));
  };

  const handleAdditionalOptionChange = (option: keyof ClothingConfig['additionalOptions']) => {
    setConfig(prev => ({
      ...prev,
      additionalOptions: {
        ...prev.additionalOptions,
        [option]: !prev.additionalOptions[option]
      }
    }));
  };

  const calculatePrice = () => {
    let basePrice = 25;
    if (config.printTechnology === 'embroidery') basePrice += 15;
    if (config.printTechnology === 'dtg') basePrice += 10;
    if (config.material === 'bamboo') basePrice += 8;
    if (config.additionalOptions.customDesign) basePrice += 20;
    if (config.additionalOptions.rush) basePrice += 15;
    return basePrice * config.quantity;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-accent via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Konfigurator Ubrań
          </h1>
          <p className="text-muted-foreground text-lg">
            Stwórz swoje wymarzone ubranie w kilku krokach
          </p>
        </div>

        <div className="grid gap-8 max-w-7xl mx-auto">
          {/* Section 1: Clothing Types */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent via-blue-500 to-purple-500 rounded-2xl blur-sm opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold text-foreground">Typ ubrania</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clothingTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleConfigChange('type', type.id)}
                    className={`group relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      config.type === type.id
                        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/30'
                        : 'border-border/30 bg-muted/30 hover:border-accent/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-3xl mb-3">{type.icon}</div>
                    <h3 className="font-semibold text-foreground mb-1">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.desc}</p>
                    
                    {config.type === type.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Section 2: Material */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl blur-sm opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Materiał</h2>
                </div>
                
                <div className="space-y-3">
                  {materials.map((material) => (
                    <button
                      key={material.id}
                      onClick={() => handleConfigChange('material', material.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        config.material === material.id
                          ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/30'
                          : 'border-border/30 bg-muted/30 hover:border-green-500/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{material.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-border/30 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500 ${
                                material.quality >= 90 ? 'w-full' : 
                                material.quality >= 85 ? 'w-5/6' : 'w-4/5'
                              }`}
                            />
                          </div>
                          <span className="text-xs text-green-400 font-medium">{material.quality}%</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Print Technology */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur-sm opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Technologia nadruku</h2>
                </div>
                
                <div className="space-y-3">
                  {printTechnologies.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => handleConfigChange('printTechnology', tech.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        config.printTechnology === tech.id
                          ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30'
                          : 'border-border/30 bg-muted/30 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{tech.icon}</span>
                        <div>
                          <div className="font-medium text-foreground">{tech.name}</div>
                          <div className="text-sm text-muted-foreground">{tech.desc}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-border/30 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-500 ${
                              tech.durability >= 95 ? 'w-full' : 
                              tech.durability >= 90 ? 'w-11/12' : 
                              tech.durability >= 85 ? 'w-5/6' : 'w-4/5'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-purple-400 font-medium">
                          Trwałość: {tech.durability}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Additional Options */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl blur-sm opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h2 className="text-2xl font-bold text-foreground">Opcje Dodatkowe</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-foreground mb-2 block">Rozmiar</span>
                    <select 
                      value={config.size}
                      onChange={(e) => handleConfigChange('size', e.target.value)}
                      className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-foreground"
                    >
                      <option value="">Wybierz rozmiar</option>
                      <option value="xs">XS</option>
                      <option value="s">S</option>
                      <option value="m">M</option>
                      <option value="l">L</option>
                      <option value="xl">XL</option>
                      <option value="xxl">XXL</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-foreground mb-2 block">Ilość</span>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={config.quantity}
                      onChange={(e) => handleConfigChange('quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-foreground"
                    />
                  </label>
                </div>

                <div className="md:col-span-2 space-y-4">
                  {Object.entries({
                    customDesign: { label: 'Własny design', desc: 'Dodaj swój unikalny projekt', icon: '🎨' },
                    rush: { label: 'Express 24h', desc: 'Szybka realizacja zamówienia', icon: '⚡' },
                    packaging: { label: 'Premium opakowanie', desc: 'Ekskluzywne pudełko prezentowe', icon: '🎁' }
                  }).map(([key, option]) => (
                    <button
                      key={key}
                      onClick={() => handleAdditionalOptionChange(key as keyof ClothingConfig['additionalOptions'])}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        config.additionalOptions[key as keyof ClothingConfig['additionalOptions']]
                          ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/30'
                          : 'border-border/30 bg-muted/30 hover:border-orange-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <div className="font-medium text-foreground">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </div>
                        <div className="ml-auto">
                          <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                            config.additionalOptions[key as keyof ClothingConfig['additionalOptions']]
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-border'
                          }`}>
                            {config.additionalOptions[key as keyof ClothingConfig['additionalOptions']] && (
                              <svg className="w-4 h-4 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Summary */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-accent rounded-2xl blur-sm opacity-25 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  📋
                </div>
                <h2 className="text-2xl font-bold text-foreground">Podsumowanie</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-xl p-4">
                    <h3 className="font-semibold text-foreground mb-3">Twoja konfiguracja:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Typ:</span>
                        <span className="text-foreground font-medium">
                          {config.type ? clothingTypes.find(t => t.id === config.type)?.name : 'Nie wybrano'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Materiał:</span>
                        <span className="text-foreground font-medium">
                          {config.material ? materials.find(m => m.id === config.material)?.name : 'Nie wybrano'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Technologia:</span>
                        <span className="text-foreground font-medium">
                          {config.printTechnology ? printTechnologies.find(p => p.id === config.printTechnology)?.name : 'Nie wybrano'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rozmiar:</span>
                        <span className="text-foreground font-medium">{config.size || 'Nie wybrano'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ilość:</span>
                        <span className="text-foreground font-medium">{config.quantity} szt.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-accent/20 to-blue-500/20 rounded-xl p-6 border border-accent/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-2">
                        €{calculatePrice()}
                      </div>
                      <div className="text-sm text-muted-foreground">Szacowana cena</div>
                    </div>
                  </div>

                  <button 
                    className="w-full py-4 px-6 bg-gradient-to-r from-accent to-blue-600 text-accent-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    disabled={!config.type || !config.material || !config.printTechnology}
                  >
                    Zamów teraz →
                  </button>

                  <button className="w-full py-3 px-6 bg-transparent border-2 border-accent text-accent font-semibold rounded-xl hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                    Zapisz konfigurację
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingConfigurator;