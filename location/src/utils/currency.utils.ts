/**
 * Currency formatting utilities for Taxibrousse application
 */

/**
 * Hook for language-aware currency formatting
 */
export const useCurrencyFormatter = () => {
  const formatAriary = (amount: number): string => {
    return `${Math.round(amount).toLocaleString('fr-FR')} Ar`;
  };

  const formatFrais = (amount: number): string => {
    return `${Math.round(amount).toLocaleString('fr-FR')} Ar`;
  };

  return { formatAriary, formatFrais };
};
