export interface Stock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
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
  stocks: Stock[];
  metrics: PortfolioMetrics;
}
