export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const currencyMap: Record<string, { symbol: string; code: string; locale: string }> = {
    'INR': { symbol: '₹', code: 'INR', locale: 'en-IN' },
    'USD': { symbol: '$', code: 'USD', locale: 'en-US' },
    'EUR': { symbol: '€', code: 'EUR', locale: 'en-EU' },
    'GBP': { symbol: '£', code: 'GBP', locale: 'en-GB' },
    'JPY': { symbol: '¥', code: 'JPY', locale: 'ja-JP' },
    'CAD': { symbol: 'C$', code: 'CAD', locale: 'en-CA' },
    'AUD': { symbol: 'A$', code: 'AUD', locale: 'en-AU' }
  };

  const currencyInfo = currencyMap[currency] || currencyMap['INR'];
  
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currencyInfo.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const getCurrencySymbol = (currency: string = 'INR'): string => {
  const currencyMap: Record<string, string> = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$'
  };

  return currencyMap[currency] || '₹';
};

export const formatINR = (amount: number): string => {
  return formatCurrency(amount, 'INR');
};
