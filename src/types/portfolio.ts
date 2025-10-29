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
  type: 'MORTGAGE' | 'CAR_LOAN' | 'PERSONAL_LOAN' | 'STUDENT_LOAN' | 'CREDIT_CARD' | 'GENERIC_LOAN' | 'PAYABLE' | 'COMMITTED_EXPENSE' | 'OTHER';
  currency: 'INR';
  isActive: boolean;
  lastUpdated: string;
  
  // Value fields (mandatory for creation)
  outstandingBalance: number; // Always required
  emiAmount?: number; // For loans
  creditLimit?: number; // For credit cards
  amountPerPeriod?: number; // For committed expenses
  amount?: number; // For payables and other
  
  // Optional fields
  interestRate?: number;
  linkedProperty?: string; // For mortgages
  lenderName?: string;
  startDate?: string;
  tenure?: string;
  loanAccountNumber?: string;
  vehicleReference?: string;
  purpose?: string;
  borrowerName?: string;
  minimumDue?: number;
  dueDate?: string;
  cardIdentifier?: string;
  loanType?: string;
  collateral?: string;
  creditorName?: string;
  recurrence?: string;
  status?: string;
  frequency?: string; // For committed expenses
  beneficiary?: string;
  nextPaymentDate?: string;
  paymentMode?: string;
  description?: string;
  secured?: boolean;
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
  | 'BONDS'
  | 'MUTUAL_FUNDS'
  | 'GOLD'
  | 'SILVER'
  | 'JEWELS'
  | 'REAL_ESTATE'
  | 'PROVIDENT_FUND'
  | 'PENSION_FUND'
  | 'RECEIVABLES'
  | 'STOCKS'
  | 'INSURANCE_LINKED'
  | 'CASH_BANK';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  currency: 'INR';
  isActive: boolean;
  lastUpdated: string;
  
  // Value fields (mandatory for creation)
  principalAmount?: number; // For FDs, bonds, real estate
  monthlyDepositAmount?: number; // For RDs
  faceValue?: number; // For bonds
  unitsHeld?: number; // For bonds, mutual funds, stocks
  quantity?: number; // For gold, silver, jewels
  weight?: number; // For jewels
  ownershipPercentage?: number; // For real estate
  amountReceivable?: number; // For receivables
  currentBalance?: number; // For PF, pension, cash
  currentValue: number; // Always required - current market value
  
  // Optional fields
  description?: string;
  startDate?: string;
  maturityDate?: string;
  interestRate?: number;
  bankName?: string;
  accountNumber?: string;
  autoRenew?: boolean; // For FDs
  tenure?: string; // For RDs
  issuerName?: string; // For bonds
  bondType?: string;
  couponRate?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  isin?: string;
  fundName?: string;
  fundHouse?: string;
  fundType?: string;
  folioNumber?: string;
  assetForm?: string; // For gold
  purity?: string;
  purchaseRate?: number;
  certificate?: string;
  hallmark?: string;
  insuranceDetails?: string;
  propertyAddress?: string;
  propertyType?: string;
  linkedMortgage?: string;
  rentalIncome?: number;
  documents?: string;
  employerName?: string;
  schemeName?: string;
  uan?: string;
  pran?: string;
  fundManager?: string;
  tier?: string;
  dueDate?: string;
  debtorName?: string;
  status?: string;
  symbol?: string;
  exchange?: string;
  averagePurchasePrice?: number;
  dematReference?: string;
  sector?: string;
  policyNumber?: string;
  insurer?: string;
  policyType?: string;
  annualPremium?: number;
  accountType?: string;
  lastSyncDate?: string;
}

export interface Portfolio {
  holdings: Holding[];
  transactions: Transaction[];
  assets: Asset[];
  metrics: PortfolioMetrics;
  lastUpdated?: string;
  lastRefreshTime?: string;
}
