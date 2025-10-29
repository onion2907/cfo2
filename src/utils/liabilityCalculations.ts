import { Liability, LiabilityPayment, LiabilityMetrics, BalanceSheet, Holding, PortfolioMetrics } from '../types/portfolio';

export const calculateLiabilityMetrics = (liabilities: Liability[]): LiabilityMetrics => {
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.currentBalance, 0);
  const totalMonthlyPayments = liabilities.reduce((sum, liability) => sum + liability.monthlyPayment, 0);
  
  const securedDebt = liabilities
    .filter(liability => liability.category === 'SECURED')
    .reduce((sum, liability) => sum + liability.currentBalance, 0);
  
  const unsecuredDebt = liabilities
    .filter(liability => liability.category === 'UNSECURED')
    .reduce((sum, liability) => sum + liability.currentBalance, 0);
  
  const shortTermDebt = liabilities
    .filter(liability => liability.term === 'SHORT_TERM')
    .reduce((sum, liability) => sum + liability.currentBalance, 0);
  
  const longTermDebt = liabilities
    .filter(liability => liability.term === 'LONG_TERM')
    .reduce((sum, liability) => sum + liability.currentBalance, 0);
  
  const totalInterestRate = liabilities.reduce((sum, liability) => sum + liability.interestRate, 0);
  const averageInterestRate = liabilities.length > 0 ? totalInterestRate / liabilities.length : 0;

  return {
    totalLiabilities,
    totalMonthlyPayments,
    securedDebt,
    unsecuredDebt,
    shortTermDebt,
    longTermDebt,
    averageInterestRate
  };
};

export const calculateBalanceSheet = (
  holdings: Holding[],
  liabilities: Liability[],
  cash: number = 0,
  otherAssets: number = 0,
  otherLiabilities: number = 0
): BalanceSheet => {
  // Calculate asset metrics
  const totalStockValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalStockCost = holdings.reduce((sum, holding) => sum + (holding.averageCost * holding.totalQuantity), 0);
  const totalStockGainLoss = totalStockValue - totalStockCost;
  const totalStockGainLossPercentage = totalStockCost > 0 ? (totalStockGainLoss / totalStockCost) * 100 : 0;

  const assetMetrics: PortfolioMetrics = {
    totalValue: totalStockValue,
    totalCost: totalStockCost,
    totalGainLoss: totalStockGainLoss,
    totalGainLossPercentage: totalStockGainLossPercentage,
    dayChange: 0, // TODO: Implement day change calculation
    dayChangePercentage: 0
  };

  // Calculate liability metrics
  const liabilityMetrics = calculateLiabilityMetrics(liabilities);

  // Calculate totals
  const totalAssets = totalStockValue + cash + otherAssets;
  const totalLiabilities = liabilityMetrics.totalLiabilities + otherLiabilities;
  const netWorth = totalAssets - totalLiabilities;

  // Categorize liabilities
  const loans = liabilities.filter(l => ['LOAN', 'MORTGAGE', 'PERSONAL_LOAN', 'STUDENT_LOAN', 'CAR_LOAN'].includes(l.type));
  const creditCards = liabilities.filter(l => l.type === 'CREDIT_CARD');
  const payables = liabilities.filter(l => ['PAYABLE', 'COMMITTED_EXPENSE'].includes(l.type));

  return {
    assets: {
      stocks: holdings,
      cash,
      otherAssets,
      totalAssets
    },
    liabilities: {
      loans,
      creditCards,
      payables,
      otherLiabilities,
      totalLiabilities
    },
    netWorth,
    metrics: {
      assetMetrics,
      liabilityMetrics,
      netWorthChange: 0, // TODO: Implement net worth change calculation
      netWorthChangePercentage: 0
    }
  };
};

export const calculateLiabilityPayments = (
  liability: Liability,
  payments: LiabilityPayment[]
): {
  totalPaid: number;
  remainingBalance: number;
  nextPaymentDate?: string;
  paymentHistory: LiabilityPayment[];
} => {
  const liabilityPayments = payments.filter(p => p.liabilityId === liability.id);
  const totalPaid = liabilityPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = liability.originalAmount - totalPaid;

  // Calculate next payment date (simplified - assumes monthly payments)
  const nextPaymentDate = liability.isActive ? 
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
    undefined;

  return {
    totalPaid,
    remainingBalance,
    nextPaymentDate,
    paymentHistory: liabilityPayments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
  };
};

export const getLiabilityTypeDisplayName = (type: Liability['type']): string => {
  const typeMap: Record<Liability['type'], string> = {
    'LOAN': 'Loan',
    'CREDIT_CARD': 'Credit Card',
    'PAYABLE': 'Payable',
    'COMMITTED_EXPENSE': 'Committed Expense',
    'MORTGAGE': 'Mortgage',
    'PERSONAL_LOAN': 'Personal Loan',
    'STUDENT_LOAN': 'Student Loan',
    'CAR_LOAN': 'Car Loan',
    'OTHER': 'Other'
  };
  return typeMap[type] || type;
};

export const getLiabilityCategoryColor = (category: Liability['category']): string => {
  return category === 'SECURED' ? 'text-green-600' : 'text-red-600';
};

export const getLiabilityTermColor = (term: Liability['term']): string => {
  return term === 'SHORT_TERM' ? 'text-orange-600' : 'text-blue-600';
};

export const formatLiabilityAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculateDebtToIncomeRatio = (
  totalMonthlyPayments: number,
  monthlyIncome: number
): number => {
  return monthlyIncome > 0 ? (totalMonthlyPayments / monthlyIncome) * 100 : 0;
};

export const calculateDebtToAssetRatio = (
  totalLiabilities: number,
  totalAssets: number
): number => {
  return totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
};
