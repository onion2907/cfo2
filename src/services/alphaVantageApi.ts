const API_KEY = 'VM94VYHT0VVANCC6';
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  marketCap: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: string;
  currency: string;
}

export interface SearchResponse {
  bestMatches: Array<{
    '1. symbol': string;
    '2. name': string;
    '3. type': string;
    '4. region': string;
    '5. marketOpen': string;
    '6. marketClose': string;
    '7. timezone': string;
    '8. currency': string;
    '9. matchScore': string;
  }>;
}

export interface QuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

class AlphaVantageAPI {
  private async makeRequest<T>(params: Record<string, string>): Promise<T> {
    const url = new URL(BASE_URL);
    url.searchParams.append('apikey', API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check for API error messages
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }
      
      if (data['Note']) {
        throw new Error('API call frequency limit reached. Please try again later.');
      }
      
      return data;
    } catch (error) {
      console.error('Alpha Vantage API Error:', error);
      throw error;
    }
  }

  async searchStocks(keywords: string): Promise<StockSearchResult[]> {
    if (!keywords.trim()) {
      return [];
    }

    try {
      const data = await this.makeRequest<SearchResponse>({
        function: 'SYMBOL_SEARCH',
        keywords: keywords.trim()
      });

      if (!data.bestMatches) {
        return [];
      }

      return data.bestMatches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: match['9. matchScore']
      }));
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw new Error('Failed to search stocks. Please try again.');
    }
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const data = await this.makeRequest<QuoteResponse>({
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase()
      });

      if (!data['Global Quote']) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }

      const quote = data['Global Quote'];
      
      // Determine currency based on symbol
      const currency = this.getCurrencyFromSymbol(symbol);
      
      return {
        symbol: quote['01. symbol'],
        name: '', // We'll need to get this from search or another endpoint
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'],
        volume: parseInt(quote['06. volume']),
        marketCap: '', // Not available in this endpoint
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        timestamp: quote['07. latest trading day'],
        currency: currency
      };
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      throw new Error(`Failed to fetch quote for ${symbol}. Please try again.`);
    }
  }

  private getCurrencyFromSymbol(symbol: string): string {
    const upperSymbol = symbol.toUpperCase();
    
    // Indian stocks (BSE/NSE)
    if (upperSymbol.includes('.BSE') || upperSymbol.includes('.NSE') || 
        upperSymbol.includes('.BO') || upperSymbol.includes('.NS')) {
      return 'INR';
    }
    
    // European stocks
    if (upperSymbol.includes('.L') || upperSymbol.includes('.PA') || 
        upperSymbol.includes('.F') || upperSymbol.includes('.DE')) {
      return 'EUR';
    }
    
    // UK stocks
    if (upperSymbol.includes('.LON')) {
      return 'GBP';
    }
    
    // Japanese stocks
    if (upperSymbol.includes('.T') || upperSymbol.includes('.TO')) {
      return 'JPY';
    }
    
    // Canadian stocks
    if (upperSymbol.includes('.TO') || upperSymbol.includes('.V')) {
      return 'CAD';
    }
    
    // Australian stocks
    if (upperSymbol.includes('.AX')) {
      return 'AUD';
    }
    
    // Default to USD for US stocks and others
    return 'USD';
  }

  async getStockInfo(symbol: string): Promise<{ name: string; price: number }> {
    try {
      // First get the quote for current price
      const quote = await this.getStockQuote(symbol);
      
      // Then search for the company name
      const searchResults = await this.searchStocks(symbol);
      const exactMatch = searchResults.find(result => 
        result.symbol.toUpperCase() === symbol.toUpperCase()
      );
      
      return {
        name: exactMatch?.name || symbol,
        price: quote.price
      };
    } catch (error) {
      console.error('Error fetching stock info:', error);
      throw new Error(`Failed to fetch information for ${symbol}. Please try again.`);
    }
  }
}

export const alphaVantageAPI = new AlphaVantageAPI();
