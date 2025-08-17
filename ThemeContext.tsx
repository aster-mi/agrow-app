import React, { createContext, useContext, useState, useMemo } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  primary: string;
  secondary: string;
  border: string;
}

interface ThemeContextValue {
  colors: ThemeColors;
  colorScheme: ColorSchemeName;
  toggleColorScheme: () => void;
}

const lightColors: ThemeColors = {
  background: '#f8fafc',
  card: '#ffffff',
  text: '#1f2937',
  primary: '#16a34a',
  secondary: '#6b7280',
  border: '#e5e7eb',
};

const darkColors: ThemeColors = {
  background: '#1f2937',
  card: '#374151',
  text: '#f3f4f6',
  primary: '#16a34a',
  secondary: '#9ca3af',
  border: '#4b5563',
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = Appearance.getColorScheme() || 'light';
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemScheme);

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const value = useMemo(() => ({ colors, colorScheme, toggleColorScheme }), [colors, colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

