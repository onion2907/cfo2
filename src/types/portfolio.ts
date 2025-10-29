export interface Stock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  currency: 'INR';
  exchange: 'BSE' | 'NSE';
  sector?: string;
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  date: string;
  currency: 'INR';
  exchange: 'BSE' | 'NSE';
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
  currency: 'INR';
  exchange: 'BSE' | 'NSE';
  sector?: string;
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
  currency: 'INR';
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
  currency: 'INR';
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

// Asset Types
export type AssetType = 
  | 'FIXED_DEPOSIT'
  | 'RECURRING_DEPOSIT'
  | 'GOLD'
  | 'SILVER'
  | 'JEWELS'
  | 'BONDS'
  | 'REAL_ESTATE'
  | 'PROVIDENT_FUND'
  | 'PENSION_FUND'
  | 'MUTUAL_FUNDS'
  | 'RECEIVABLES'
  | 'STOCKS';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  amount: number;
  currency: 'INR';
  description?: string;
  purchaseDate?: string;
  maturityDate?: string;
  interestRate?: number;
  currentValue?: number;
  isActive: boolean;
  lastUpdated: string;
  // Type-specific fields
  bankName?: string; // For FDs, RDs
  accountNumber?: string; // For FDs, RDs
  weight?: number; // For gold, silver, jewels (in grams)
  purity?: string; // For gold, silver (e.g., "24K", "999")
  propertyAddress?: string; // For real estate
  propertyType?: string; // For real estate (residential, commercial, land)
  fundName?: string; // For mutual funds, provident fund, pension fund
  fundHouse?: string; // For mutual funds
  nav?: number; // For mutual funds
  units?: number; // For mutual funds
  dueDate?: string; // For receivables
  debtorName?: string; // For receivables
}

export interface Portfolio {
  holdings: Holding[];
  transactions: Transaction[];
  assets: Asset[];
  metrics: PortfolioMetrics;
  lastUpdated?: string;
  lastRefreshTime?: string;
}
