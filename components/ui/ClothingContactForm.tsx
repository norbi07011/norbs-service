import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';

interface ClothingContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  clothingTypes: string[];
  quantity: string;
  budget: string;
  timeline: string;
  materials: string[];
  printTechnologies: string[];
  description: string;
  hasDesign: string;
  designFiles: File[];
}

const initialFormData: ClothingContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: '',
  clothingTypes: [],
  quantity: '',
  budget: '',
  timeline: '',
  materials: [],
  printTechnologies: [],
  description: '',
  hasDesign: '',
  designFiles: []
};

const clothingTypes = [
  'T-shirt', 'Polo', 'Bluza', 'Hoodie', 'Koszulka z długim rękawem',
  'Tank top', 'Kurtka', 'Spodnie', 'Inne'
];

const materials = [
  'Bawełna', 'Bawełna organiczna', 'Poliester', 'Performance blend',
  'Bambus', 'Konopie', 'Merino wool', 'Inne'
];

const printTechnologies = [
  'DTG (Direct to Garment)', 'Sitodruk', 'Haft komputerowy', 'Sublimacja',
  'Folia Flex/Flock', 'Vinyl', 'Puff print', 'Inne'
];

const ClothingContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ClothingContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ClothingContactFormData) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, designFiles: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addToast('Zapytanie zostało wysłane! Skontaktujemy się z Tobą w ciągu 24 godzin.', 'success');
      setFormData(initialFormData);
    } catch (error) {
      addToast('Wystąpił błąd podczas wysyłania. Spróbuj ponownie.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Zapytanie o Projekt Odzieżowy
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Wypełnij formularz, a nasz zespół przygotuje dla Ciebie spersonalizowaną ofertę. 
              Odpowiemy w ciągu 24 godzin!
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2 text-foreground">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Jan Kowalski"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="jan@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-foreground">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="+31 6 123 456 789"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold mb-2 text-foreground">
                    Firma / Organizacja
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Nazwa firmy"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="projectType" className="block text-sm font-semibold mb-2 text-foreground">
                    Typ projektu *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  >
                    <option value="">Wybierz typ projektu</option>
                    <option value="personal">Projekt osobisty</option>
                    <option value="business">Ubrania firmowe</option>
                    <option value="event">Wydarzenie/Event</option>
                    <option value="sport">Drużyna sportowa</option>
                    <option value="brand">Marka odzieżowa</option>
                    <option value="other">Inne</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-semibold mb-2 text-foreground">
                    Ilość sztuk *
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  >
                    <option value="">Wybierz ilość</option>
                    <option value="1-10">1-10 sztuk</option>
                    <option value="11-50">11-50 sztuk</option>
                    <option value="51-100">51-100 sztuk</option>
                    <option value="101-500">101-500 sztuk</option>
                    <option value="500+">Powyżej 500 sztuk</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-semibold mb-2 text-foreground">
                    Budżet
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  >
                    <option value="">Wybierz budżet</option>
                    <option value="0-500">Do 500 zł</option>
                    <option value="500-1000">500-1000 zł</option>
                    <option value="1000-2500">1000-2500 zł</option>
                    <option value="2500-5000">2500-5000 zł</option>
                    <option value="5000+">Powyżej 5000 zł</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-semibold mb-2 text-foreground">
                    Termin realizacji
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  >
                    <option value="">Wybierz termin</option>
                    <option value="asap">Jak najszybciej (2-3 dni)</option>
                    <option value="week">Do tygodnia</option>
                    <option value="2weeks">Do 2 tygodni</option>
                    <option value="month">Do miesiąca</option>
                    <option value="flexible">Elastyczny</option>
                  </select>
                </div>
              </div>

              {/* Clothing Types */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  Typy ubrań (wybierz wszystkie, które Cię interesują)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {clothingTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={type}
                        checked={formData.clothingTypes.includes(type)}
                        onChange={(e) => handleCheckboxChange(e, 'clothingTypes')}
                        className="rounded border-border text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-foreground">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  Preferowane materiały
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {materials.map((material) => (
                    <label key={material} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={material}
                        checked={formData.materials.includes(material)}
                        onChange={(e) => handleCheckboxChange(e, 'materials')}
                        className="rounded border-border text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-foreground">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Print Technologies */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  Preferowane technologie nadruku
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {printTechnologies.map((tech) => (
                    <label key={tech} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={tech}
                        checked={formData.printTechnologies.includes(tech)}
                        onChange={(e) => handleCheckboxChange(e, 'printTechnologies')}
                        className="rounded border-border text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-foreground">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Design */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  Czy masz gotowy projekt graficzny?
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasDesign"
                      value="yes"
                      checked={formData.hasDesign === 'yes'}
                      onChange={handleInputChange}
                      className="border-border text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-foreground">Tak, mam gotowy projekt</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasDesign"
                      value="no"
                      checked={formData.hasDesign === 'no'}
                      onChange={handleInputChange}
                      className="border-border text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-foreground">Nie, potrzebuję projektu</span>
                  </label>
                </div>
              </div>

              {/* File Upload */}
              {formData.hasDesign === 'yes' && (
                <div>
                  <label htmlFor="designFiles" className="block text-sm font-semibold mb-2 text-foreground">
                    Załącz pliki projektu
                  </label>
                  <input
                    type="file"
                    id="designFiles"
                    multiple
                    accept=".ai,.eps,.pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Akceptowane formaty: AI, EPS, PDF, PNG, JPG (max 10MB każdy)
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold mb-2 text-foreground">
                  Opis projektu *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground resize-none"
                  placeholder="Opisz swój projekt, wizję, cel, inspiracje, specjalne wymagania..."
                />
              </div>

              {/* Submit */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg min-w-[200px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Wysyłanie...</span>
                    </div>
                  ) : (
                    'Wyślij zapytanie'
                  )}
                </button>
                <p className="text-sm text-muted-foreground mt-3">
                  Odpowiemy w ciągu 24 godzin
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClothingContactForm;