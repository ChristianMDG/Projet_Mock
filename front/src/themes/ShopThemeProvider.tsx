import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { appTheme } from './appTheme';

interface ShopThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ShopThemeProvider
 * Branché directement sur appTheme pour visualiser et appliquer
 * le thème principal de l'application sur toutes les pages de la boutique.
 */
export const ShopThemeProvider: React.FC<ShopThemeProviderProps> = ({ children }) => {
  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
};

export default ShopThemeProvider;
