import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import { BalanceSheet } from '../types/portfolio';
import { formatCurrency } from '../utils/currency';

interface BalanceSheetSummaryProps {
  balanceSheet: BalanceSheet;
  displayCurrency: string;
}

const BalanceSheetSummary: React.FC<BalanceSheetSummaryProps> = ({
  balanceSheet,
  displayCurrency
}) => {
  const formatAmount = (amount: number) => {
    return formatCurrency(amount, displayCurrency);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getNetWorthColor = (netWorth: number) => {
    return netWorth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getNetWorthIcon = (netWorth: number) => {
    return netWorth >= 0 ? (
      <TrendingUp className="h-5 w-5 text-green-600" />
    ) : (
      <TrendingDown className="h-5 w-5 text-red-600" />
    );
  };

  const getDebtToAssetRatio = () => {
    if (balanceSheet.assets.totalAssets === 0) return 0;
    return (balanceSheet.liabilities.totalLiabilities / balanceSheet.assets.totalAssets) * 100;
  };

  const getDebtToAssetColor = (ratio: number) => {
    if (ratio <= 30) return 'text-green-600';
    if (ratio <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Net Worth Card */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Net Worth</h3>
            {getNetWorthIcon(balanceSheet.netWorth)}
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              <span className={getNetWorthColor(balanceSheet.netWorth)}>
                {formatAmount(balanceSheet.netWorth)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Assets: {formatAmount(balanceSheet.assets.totalAssets)}
            </div>
            <div className="text-sm text-gray-500">
              Liabilities: {formatAmount(balanceSheet.liabilities.totalLiabilities)}
            </div>
          </div>
        </div>
      </div>

      {/* Assets Breakdown */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stock Portfolio</span>
              <span className="text-sm font-medium text-gray-900">
                {formatAmount(balanceSheet.assets.stocks.reduce((sum, stock) => sum + stock.currentValue, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cash</span>
              <span className="text-sm font-medium text-gray-900">
                {formatAmount(balanceSheet.assets.cash)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Other Assets</span>
              <span className="text-sm font-medium text-gray-900">
                {formatAmount(balanceSheet.assets.otherAssets)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">Total Assets</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatAmount(balanceSheet.assets.totalAssets)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liabilities Breakdown */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Liabilities</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Loans</span>
              <span className="text-sm font-medium text-gray-900">
                {formatAmount(balanceSheet.liabilities.loans.reduce((sum, loan) => sum + loan.currentBalance, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Credit Cards</span>
              <span className="text-sm font-medium text-gray-900">
                {formatAmount(balanceSheet.liabilities.creditCards.reduce((sum, card) => sum + card.currentBalance, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payables</span>
              <span className="text-sm font-medium text-gray-900">
                {formatAmount(balanceSheet.liabilities.payables.reduce((sum, payable) => sum + payable.currentBalance, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Other Liabilities</span>
              <span className="text-sm font-medium text-gray-900">
                {formatAmount(balanceSheet.liabilities.otherLiabilities)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">Total Liabilities</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatAmount(balanceSheet.liabilities.totalLiabilities)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Metrics */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatPercentage(getDebtToAssetRatio())}
              </div>
              <div className="text-sm text-gray-600">Debt-to-Asset Ratio</div>
              <div className={`text-xs mt-1 ${
                getDebtToAssetColor(getDebtToAssetRatio())
              }`}>
                {getDebtToAssetRatio() <= 30 ? 'Excellent' : 
                 getDebtToAssetRatio() <= 50 ? 'Good' : 'Needs Attention'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatAmount(balanceSheet.metrics.liabilityMetrics.totalMonthlyPayments)}
              </div>
              <div className="text-sm text-gray-600">Monthly Payments</div>
              <div className="text-xs text-gray-500 mt-1">
                {balanceSheet.liabilities.loans.length + balanceSheet.liabilities.creditCards.length + balanceSheet.liabilities.payables.length} active liabilities
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatPercentage(balanceSheet.metrics.liabilityMetrics.averageInterestRate)}
              </div>
              <div className="text-sm text-gray-600">Avg Interest Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                Weighted average
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {balanceSheet.metrics.liabilityMetrics.securedDebt > 0 ? 
                  formatPercentage((balanceSheet.metrics.liabilityMetrics.securedDebt / balanceSheet.metrics.liabilityMetrics.totalLiabilities) * 100) : 
                  '0%'
                }
              </div>
              <div className="text-sm text-gray-600">Secured Debt</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatAmount(balanceSheet.metrics.liabilityMetrics.securedDebt)} secured
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetSummary;
