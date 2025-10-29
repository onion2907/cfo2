// Indian Stock Market API Service
// Focused on Indian stocks with INR currency

// Configuration
const USE_REAL_API = true; // Set to false to use only mock data
const BASE_URL = 'https://indianapi.in/api'; // Indian API marketplace
const API_KEY = 'sk-live-6pnOC4qCbj10La77gSeqOHHMAOW55lU8mb2NDYVr';

// Mock data for development
const MOCK_STOCKS: IndianStockSearchResult[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE', currentPrice: 2650.50, sector: 'Oil & Gas' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', exchange: 'NSE', currentPrice: 3850.25, sector: 'IT' },
  { symbol: 'HDFC', name: 'HDFC Bank Ltd', exchange: 'NSE', currentPrice: 1580.75, sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE', currentPrice: 1420.30, sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', exchange: 'NSE', currentPrice: 920.45, sector: 'Banking' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', exchange: 'NSE', currentPrice: 2450.80, sector: 'FMCG' },
  { symbol: 'ITC', name: 'ITC Ltd', exchange: 'NSE', currentPrice: 420.15, sector: 'FMCG' },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', currentPrice: 580.90, sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE', currentPrice: 980.60, sector: 'Telecom' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', exchange: 'NSE', currentPrice: 3200.40, sector: 'Paints' }
];

// Types for Indian Stock API
export interface IndianStockSearchResult {
  symbol: string;
  name: string;
  exchange: 'BSE' | 'NSE';
  sector?: string;
  marketCap?: number;
  currentPrice?: number;
  type?: string;
  region?: string;
  currency?: 'INR';
}

export interface IndianStockQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  marketCap: number;
  exchange: 'BSE' | 'NSE';
  sector?: string;
  currency: 'INR';
  price?: number;
}

export interface IndianStockDetails {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  marketCap: number;
  exchange: 'BSE' | 'NSE';
  sector: string;
  industry: string;
  currency: 'INR';
  pe: number;
  pb: number;
  dividendYield: number;
  eps: number;
  bookValue: number;
  faceValue: number;
}

export interface TrendingStock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  exchange: 'BSE' | 'NSE';
}

export interface MostActiveStock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  value: number;
  exchange: 'BSE' | 'NSE';
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MutualFund {
  symbol: string;
  name: string;
  nav: number;
  change: number;
  changePercent: number;
  category: string;
  fundHouse: string;
  currency: 'INR';
}

class IndianStockAPI {
  private refreshCache: Map<string, { data: any; timestamp: number }> = new Map();

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      console.log(`Making Indian Stock API request to: ${url.toString()}`);
      
      const response = await fetch(url.toString(), {
        headers: {
          'x-api-key': API_KEY,
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Indian Stock API response:', data);

      return data;
    } catch (error) {
      console.error('Indian Stock API Error:', error);
      throw error;
    }
  }

  // Search for Indian stocks
  async searchStocks(query: string): Promise<IndianStockSearchResult[]> {
    try {
      if (USE_REAL_API) {
        // Try to search using IndianAPI.in
        try {
          const data = await this.makeRequest<any>('/stock', { name: query });
          if (data && data.symbol) {
            return [{
              symbol: data.symbol,
              name: data.name || query,
              exchange: data.exchange || 'NSE',
              currentPrice: data.current_price || data.price,
              sector: data.sector,
              marketCap: data.market_cap
            }];
          }
        } catch (apiError) {
          console.log('IndianAPI.in search failed, using mock data:', apiError);
        }
      }

      // Fallback to mock data
      return MOCK_STOCKS.filter(stock => 
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching Indian stocks:', error);
      return [];
    }
  }

  // Get stock details by name
  async getStockDetails(stockName: string): Promise<IndianStockDetails | null> {
    try {
      const data = await this.makeRequest<any>('/stock', { name: stockName });
      
      // Transform API response to our interface
      return {
        symbol: data.symbol || stockName,
        name: data.name || stockName,
        currentPrice: data.current_price || data.price || 0,
        change: data.change || 0,
        changePercent: data.change_percent || 0,
        open: data.open || 0,
        high: data.high || 0,
        low: data.low || 0,
        previousClose: data.previous_close || 0,
        volume: data.volume || 0,
        marketCap: data.market_cap || 0,
        exchange: data.exchange || 'NSE',
        sector: data.sector || '',
        industry: data.industry || '',
        currency: 'INR',
        pe: data.pe || 0,
        pb: data.pb || 0,
        dividendYield: data.dividend_yield || 0,
        eps: data.eps || 0,
        bookValue: data.book_value || 0,
        faceValue: data.face_value || 0
      };
    } catch (error) {
      console.error('Error fetching stock details:', error);
      return null;
    }
  }

  // Get current stock quote
  async getStockQuote(symbol: string): Promise<IndianStockQuote | null> {
    try {
      // Try to fetch real data first if enabled
      if (USE_REAL_API) {
        const realQuote = await this.fetchRealStockQuote(symbol);
        if (realQuote) {
          return realQuote;
        }
      }

      // Fallback to mock data if real API fails
      const mockStock = MOCK_STOCKS.find(stock => 
        stock.symbol.toLowerCase() === symbol.toLowerCase()
      );
      
      if (mockStock) {
        return {
          symbol: mockStock.symbol,
          name: mockStock.name,
          currentPrice: mockStock.currentPrice || 0,
          change: Math.random() * 100 - 50, // Random change for demo
          changePercent: Math.random() * 10 - 5, // Random percentage for demo
          open: (mockStock.currentPrice || 0) + Math.random() * 20 - 10,
          high: (mockStock.currentPrice || 0) + Math.random() * 50,
          low: (mockStock.currentPrice || 0) - Math.random() * 30,
          previousClose: (mockStock.currentPrice || 0) + Math.random() * 20 - 10,
          volume: Math.floor(Math.random() * 1000000),
          marketCap: Math.floor(Math.random() * 1000000000000),
          exchange: mockStock.exchange,
          sector: mockStock.sector,
          currency: 'INR'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      return null;
    }
  }

  // Fetch real stock quote from IndianAPI.in
  private async fetchRealStockQuote(symbol: string): Promise<IndianStockQuote | null> {
    try {
      console.log(`Fetching real data for ${symbol} from IndianAPI.in`);
      
      // Use the stock endpoint from your API specification
      const data = await this.makeRequest<any>('/stock', { name: symbol });
      console.log('IndianAPI.in response:', data);

      if (data && data.current_price !== undefined) {
        const currentPrice = data.current_price || data.price || 0;
        const previousClose = data.previous_close || currentPrice;
        const change = data.change || (currentPrice - previousClose);
        const changePercent = data.change_percent || (previousClose > 0 ? (change / previousClose) * 100 : 0);

        return {
          symbol: data.symbol || symbol,
          name: data.name || symbol,
          currentPrice: currentPrice,
          change: change,
          changePercent: changePercent,
          open: data.open || currentPrice,
          high: data.high || currentPrice,
          low: data.low || currentPrice,
          previousClose: previousClose,
          volume: data.volume || 0,
          marketCap: data.market_cap || 0,
          exchange: data.exchange || 'NSE',
          sector: data.sector || 'Unknown',
          currency: 'INR'
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching real stock quote from IndianAPI.in:', error);
      return null;
    }
  }

  // Get trending stocks
  async getTrendingStocks(): Promise<TrendingStock[]> {
    try {
      const data = await this.makeRequest<any[]>('/trending');
      
      return data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.current_price || stock.price || 0,
        change: stock.change || 0,
        changePercent: stock.change_percent || 0,
        volume: stock.volume || 0,
        exchange: stock.exchange || 'NSE'
      }));
    } catch (error) {
      console.error('Error fetching trending stocks from IndianAPI.in:', error);
      // Fallback to mock data
      return MOCK_STOCKS.slice(0, 5).map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.currentPrice || 0,
        change: Math.random() * 100 - 50,
        changePercent: Math.random() * 10 - 5,
        volume: Math.floor(Math.random() * 1000000),
        exchange: stock.exchange
      }));
    }
  }

  // Get most active stocks (BSE)
  async getBSEMostActive(): Promise<MostActiveStock[]> {
    try {
      const data = await this.makeRequest<any[]>('/BSE_most_active');
      
      return data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.current_price || stock.price || 0,
        change: stock.change || 0,
        changePercent: stock.change_percent || 0,
        volume: stock.volume || 0,
        value: stock.value || 0,
        exchange: 'BSE' as const
      }));
    } catch (error) {
      console.error('Error fetching BSE most active stocks:', error);
      return [];
    }
  }

  // Get most active stocks (NSE)
  async getNSEMostActive(): Promise<MostActiveStock[]> {
    try {
      const data = await this.makeRequest<any[]>('/NSE_most_active');
      
      return data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.current_price || stock.price || 0,
        change: stock.change || 0,
        changePercent: stock.change_percent || 0,
        volume: stock.volume || 0,
        value: stock.value || 0,
        exchange: 'NSE' as const
      }));
    } catch (error) {
      console.error('Error fetching NSE most active stocks:', error);
      return [];
    }
  }

  // Get historical data
  async getHistoricalData(
    stockName: string, 
    period: '1m' | '6m' | '1yr' | '3yr' | '5yr' | '10yr' | 'max',
    filter: 'default' | 'price' | 'pe' | 'sm' | 'evebitda' | 'ptb' | 'mcs'
  ): Promise<HistoricalData[]> {
    try {
      const data = await this.makeRequest<any[]>('/historical_data', {
        stock_name: stockName,
        period,
        filter
      });
      
      return data.map(item => ({
        date: item.date,
        open: item.open || 0,
        high: item.high || 0,
        low: item.low || 0,
        close: item.close || 0,
        volume: item.volume || 0
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  }

  // Get mutual funds
  async getMutualFunds(): Promise<MutualFund[]> {
    try {
      const data = await this.makeRequest<any[]>('/mutual_funds');
      
      return data.map(fund => ({
        symbol: fund.symbol,
        name: fund.name,
        nav: fund.nav || 0,
        change: fund.change || 0,
        changePercent: fund.change_percent || 0,
        category: fund.category || '',
        fundHouse: fund.fund_house || '',
        currency: 'INR' as const
      }));
    } catch (error) {
      console.error('Error fetching mutual funds:', error);
      return [];
    }
  }

  // Get 52-week high/low data
  async get52WeekHighLow(): Promise<any[]> {
    try {
      const data = await this.makeRequest<any[]>('/fetch_52_week_high_low_data');
      return data;
    } catch (error) {
      console.error('Error fetching 52-week high/low data:', error);
      return [];
    }
  }

  // Get price shockers
  async getPriceShockers(): Promise<TrendingStock[]> {
    try {
      const data = await this.makeRequest<any[]>('/price_shockers');
      
      return data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.current_price || stock.price || 0,
        change: stock.change || 0,
        changePercent: stock.change_percent || 0,
        volume: stock.volume || 0,
        exchange: stock.exchange || 'NSE'
      }));
    } catch (error) {
      console.error('Error fetching price shockers:', error);
      return [];
    }
  }

  // Get commodities data
  async getCommodities(): Promise<any[]> {
    try {
      const data = await this.makeRequest<any[]>('/commodities');
      return data;
    } catch (error) {
      console.error('Error fetching commodities:', error);
      return [];
    }
  }

  // Get news
  async getNews(): Promise<any[]> {
    try {
      const data = await this.makeRequest<any[]>('/news');
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  // Get IPO data
  async getIPOData(): Promise<any[]> {
    try {
      const data = await this.makeRequest<any[]>('/ipo');
      return data;
    } catch (error) {
      console.error('Error fetching IPO data:', error);
      return [];
    }
  }

  // Refresh all data - clear cache and fetch fresh data
  async refreshAllData(): Promise<void> {
    console.log('Refreshing all API data...');
    console.log('Real API enabled:', USE_REAL_API);
    console.log('API Base URL:', BASE_URL);
    this.refreshCache.clear();
    
    // Test API connectivity
    if (USE_REAL_API) {
      try {
        const testSymbol = 'RELIANCE';
        console.log(`Testing API with ${testSymbol}...`);
        const testQuote = await this.fetchRealStockQuote(testSymbol);
        if (testQuote) {
          console.log('✅ API is working! Test quote:', testQuote);
        } else {
          console.log('❌ API test failed - will use mock data');
        }
      } catch (error) {
        console.log('❌ API test error:', error);
      }
    }
    
    console.log('Cache cleared. Fresh data will be fetched on next request.');
  }

  // Get fresh stock quote (bypass cache)
  async getFreshStockQuote(symbol: string): Promise<IndianStockQuote | null> {
    try {
      // Clear cache for this symbol
      this.refreshCache.delete(`quote_${symbol}`);
      
      // Try to fetch real data first if enabled
      if (USE_REAL_API) {
        const realQuote = await this.fetchRealStockQuote(symbol);
        if (realQuote) {
          console.log(`Fresh real data fetched for ${symbol}:`, realQuote.currentPrice);
          return realQuote;
        }
      }

      // Fallback to mock data with some randomization
      const mockStock = MOCK_STOCKS.find(stock => 
        stock.symbol.toLowerCase() === symbol.toLowerCase()
      );
      
      if (mockStock) {
        // Add some random variation to simulate market movement
        const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
        const newPrice = (mockStock.currentPrice || 0) * (1 + variation);
        
        console.log(`Using mock data for ${symbol} with variation:`, variation);
        
        return {
          symbol: mockStock.symbol,
          name: mockStock.name,
          currentPrice: newPrice,
          change: (Math.random() - 0.5) * 100, // Random change for demo
          changePercent: (Math.random() - 0.5) * 10, // Random percentage for demo
          open: newPrice + (Math.random() * 20 - 10),
          high: newPrice + Math.random() * 50,
          low: newPrice - Math.random() * 30,
          previousClose: newPrice + (Math.random() * 20 - 10),
          volume: Math.floor(Math.random() * 1000000),
          marketCap: Math.floor(Math.random() * 1000000000000),
          exchange: mockStock.exchange,
          sector: mockStock.sector,
          currency: 'INR'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching fresh stock quote:', error);
      return null;
    }
  }
}

export const indianStockAPI = new IndianStockAPI();
