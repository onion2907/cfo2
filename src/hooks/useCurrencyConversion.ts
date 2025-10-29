import { useState, useEffect, useCallback } from 'react';
import { Stock } from '../types/portfolio';
import { currencyConversionService, ConvertedPortfolio } from '../services/currencyConversion';

export interface UseCurrencyConversionReturn {
  selectedCurrency: string;
  convertedPortfolio: ConvertedPortfolio | null;
  isLoading: boolean;
  error: string | null;
  setSelectedCurrency: (currency: string) => void;
  refreshConversion: () => Promise<void>;
  supportedCurrencies: string[];
}

export const useCurrencyConversion = (
  stocks: Stock[],
  initialCurrency: string = 'USD'
): UseCurrencyConversionReturn => {
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
  const [convertedPortfolio, setConvertedPortfolio] = useState<ConvertedPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supportedCurrencies] = useState(currencyConversionService.getSupportedCurrencies());

  const convertPortfolio = useCallback(async (currency: string) => {
    if (stocks.length === 0) {
      setConvertedPortfolio(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const converted = await currencyConversionService.convertPortfolioToCurrency(stocks, currency);
      setConvertedPortfolio(converted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert portfolio');
      console.error('Currency conversion error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [stocks]);

  const handleCurrencyChange = useCallback((currency: string) => {
    setSelectedCurrency(currency);
    convertPortfolio(currency);
  }, [convertPortfolio]);

  const refreshConversion = useCallback(async () => {
    await convertPortfolio(selectedCurrency);
  }, [convertPortfolio, selectedCurrency]);

  // Convert portfolio when stocks change or currency changes
  useEffect(() => {
    convertPortfolio(selectedCurrency);
  }, [convertPortfolio, selectedCurrency]);

  return {
    selectedCurrency,
    convertedPortfolio,
    isLoading,
    error,
    setSelectedCurrency: handleCurrencyChange,
    refreshConversion,
    supportedCurrencies
  };
};
