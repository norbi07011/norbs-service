import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'premium';
type CardColor = 'green' | 'blue';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cardColor: CardColor;
  setCardColor: (color: CardColor) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('norbs-theme') as Theme | null;
      return savedTheme || 'dark'; // default theme
    } catch (error) {
      return 'dark';
    }
  });

  const [cardColor, setCardColor] = useState<CardColor>(() => {
    try {
      const savedColor = localStorage.getItem('norbs-card-color') as CardColor | null;
      return savedColor || 'green'; // default color
    } catch (error) {
      return 'green';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'premium');
    root.classList.add(theme);
    try {
      localStorage.setItem('norbs-theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  useEffect(() => {
    const body = window.document.body;
    body.classList.remove('card-color-green', 'card-color-blue');
    body.classList.add(`card-color-${cardColor}`);
    try {
      localStorage.setItem('norbs-card-color', cardColor);
    } catch (error) {
      console.error("Failed to save card color to localStorage", error);
    }
  }, [cardColor]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cardColor, setCardColor }}>
      {children}
    </ThemeContext.Provider>
  );
};