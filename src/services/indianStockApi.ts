// Indian Stock Market API Service
// Focused on Indian stocks with INR currency

const BASE_URL = 'https://api.indianstockmarket.com'; // Replace with actual API URL
const API_KEY = 'sk-live-6pnOC4qCbj10La77gSeqOHHMAOW55lU8mb2NDYVr';

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
          'Content-Type': 'application/json',
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
      // Use trending stocks as search results for now
      // In a real implementation, you'd have a dedicated search endpoint
      const trending = await this.getTrendingStocks();
      return trending
        .filter(stock => 
          stock.name.toLowerCase().includes(query.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(query.toLowerCase())
        )
        .map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          exchange: stock.exchange,
          currentPrice: stock.currentPrice,
          marketCap: 0 // Would be populated from actual API
        }));
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
      const data = await this.makeRequest<any>('/stock', { name: symbol });
      
      return {
        symbol: data.symbol || symbol,
        name: data.name || symbol,
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
        sector: data.sector,
        currency: 'INR'
      };
    } catch (error) {
      console.error('Error fetching stock quote:', error);
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
      console.error('Error fetching trending stocks:', error);
      return [];
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
}

export const indianStockAPI = new IndianStockAPI();
