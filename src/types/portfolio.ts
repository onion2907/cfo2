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

// Liability Types
export interface Liability {
  id: string;
  name: string;
  type: 'LOAN' | 'CREDIT_CARD' | 'PAYABLE' | 'COMMITTED_EXPENSE' | 'MORTGAGE' | 'PERSONAL_LOAN' | 'STUDENT_LOAN' | 'CAR_LOAN' | 'OTHER';
  category: 'SECURED' | 'UNSECURED';
  term: 'SHORT_TERM' | 'LONG_TERM';
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  startDate: string;
  endDate?: string;
  currency: string;
  lender?: string;
  description?: string;
  isActive: boolean;
}

export interface LiabilityPayment {
  id: string;
  liabilityId: string;
  amount: number;
  paymentDate: string;
  paymentType: 'PRINCIPAL' | 'INTEREST' | 'BOTH';
  notes?: string;
  currency: string;
}

export interface LiabilityMetrics {
  totalLiabilities: number;
  totalMonthlyPayments: number;
  securedDebt: number;
  unsecuredDebt: number;
  shortTermDebt: number;
  longTermDebt: number;
  averageInterestRate: number;
}

// Balance Sheet Types
export interface BalanceSheet {
  assets: {
    stocks: Holding[];
    cash: number;
    otherAssets: number;
    totalAssets: number;
  };
  liabilities: {
    loans: Liability[];
    creditCards: Liability[];
    payables: Liability[];
    otherLiabilities: number;
    totalLiabilities: number;
  };
  netWorth: number;
  metrics: {
    assetMetrics: PortfolioMetrics;
    liabilityMetrics: LiabilityMetrics;
    netWorthChange: number;
    netWorthChangePercentage: number;
  };
}

export interface Portfolio {
  holdings: Holding[];
  transactions: Transaction[];
  metrics: PortfolioMetrics;
}
