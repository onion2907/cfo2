// Fallback exchange rates when Alpha Vantage API is not available
// These are approximate rates and should be updated regularly
export const FALLBACK_EXCHANGE_RATES: Record<string, Record<string, number>> = {
  'USD': {
    'INR': 83.0,
    'EUR': 0.85,
    'GBP': 0.78,
    'JPY': 150.0,
    'CAD': 1.35,
    'AUD': 1.50,
    'CHF': 0.88,
    'CNY': 7.20,
    'SGD': 1.35
  },
  'INR': {
    'USD': 0.012,
    'EUR': 0.010,
    'GBP': 0.009,
    'JPY': 1.81,
    'CAD': 0.016,
    'AUD': 0.018,
    'CHF': 0.011,
    'CNY': 0.087,
    'SGD': 0.016
  },
  'EUR': {
    'USD': 1.18,
    'INR': 98.0,
    'GBP': 0.92,
    'JPY': 176.0,
    'CAD': 1.59,
    'AUD': 1.76,
    'CHF': 1.04,
    'CNY': 8.47,
    'SGD': 1.59
  },
  'GBP': {
    'USD': 1.28,
    'INR': 106.0,
    'EUR': 1.09,
    'JPY': 192.0,
    'CAD': 1.73,
    'AUD': 1.92,
    'CHF': 1.13,
    'CNY': 9.23,
    'SGD': 1.73
  }
};

export const getFallbackExchangeRate = (fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) {
    return 1.0;
  }

  // Try direct conversion
  if (FALLBACK_EXCHANGE_RATES[fromCurrency]?.[toCurrency]) {
    return FALLBACK_EXCHANGE_RATES[fromCurrency][toCurrency];
  }

  // Try reverse conversion
  if (FALLBACK_EXCHANGE_RATES[toCurrency]?.[fromCurrency]) {
    return 1.0 / FALLBACK_EXCHANGE_RATES[toCurrency][fromCurrency];
  }

  // Try USD as intermediate currency
  if (FALLBACK_EXCHANGE_RATES['USD']?.[fromCurrency] && FALLBACK_EXCHANGE_RATES['USD']?.[toCurrency]) {
    const fromToUsd = 1.0 / FALLBACK_EXCHANGE_RATES['USD'][fromCurrency];
    const usdToTarget = FALLBACK_EXCHANGE_RATES['USD'][toCurrency];
    return fromToUsd * usdToTarget;
  }

  // Default fallback - assume 1:1 if no rate found
  console.warn(`No fallback exchange rate found for ${fromCurrency} to ${toCurrency}, using 1:1`);
  return 1.0;
};
