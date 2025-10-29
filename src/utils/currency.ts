export const formatCurrency = (amount: number, currency: string): string => {
  const currencyMap: Record<string, { symbol: string; code: string }> = {
    'USD': { symbol: '$', code: 'USD' },
    'INR': { symbol: '₹', code: 'INR' },
    'EUR': { symbol: '€', code: 'EUR' },
    'GBP': { symbol: '£', code: 'GBP' },
    'JPY': { symbol: '¥', code: 'JPY' },
    'CAD': { symbol: 'C$', code: 'CAD' },
    'AUD': { symbol: 'A$', code: 'AUD' }
  };

  const currencyInfo = currencyMap[currency] || currencyMap['USD'];
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyInfo.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const getCurrencySymbol = (currency: string): string => {
  const currencyMap: Record<string, string> = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$'
  };

  return currencyMap[currency] || '$';
};
