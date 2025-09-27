
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, LanguageContextType } from '../types';
import * as translations from '../translations';

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedTranslation = (obj: any, key: string): string | undefined => {
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('norbs-lang');
      return (savedLang as Language) || 'nl';
    } catch (error) {
      return 'nl';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('norbs-lang', language);
    } catch (error) {
      console.error("Failed to save language to localStorage", error);
    }
  }, [language]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    const langFile = translations[language];
    let translation = getNestedTranslation(langFile, key) || key;

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
      });
    }

    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
