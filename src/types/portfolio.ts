export interface Stock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  currency: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  date: string;
  currency: string;
  notes?: string;
}

export interface Holding {
  symbol: string;
  name: string;
  totalQuantity: number;
  averageCost: number;
  lastTradedPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  currency: string;
  transactions: Transaction[];
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
}

export interface Portfolio {
  holdings: Holding[];
  transactions: Transaction[];
  metrics: PortfolioMetrics;
}
