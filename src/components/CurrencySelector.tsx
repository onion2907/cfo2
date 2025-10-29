import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { getCurrencySymbol } from '../utils/currency';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  supportedCurrencies: string[];
  isLoading?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  supportedCurrencies,
  isLoading = false
}) => {
  const currencyNames: Record<string, string> = {
    'USD': 'US Dollar',
    'INR': 'Indian Rupee',
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'JPY': 'Japanese Yen',
    'CAD': 'Canadian Dollar',
    'AUD': 'Australian Dollar',
    'CHF': 'Swiss Franc',
    'CNY': 'Chinese Yuan',
    'SGD': 'Singapore Dollar'
  };

  return (
    <div className="relative">
      <select
        value={selectedCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        disabled={isLoading}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {supportedCurrencies.map((currency) => (
          <option key={currency} value={currency}>
            {getCurrencySymbol(currency)} {currency} - {currencyNames[currency] || currency}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary-600"></div>
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </div>
      
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Globe className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default CurrencySelector;
