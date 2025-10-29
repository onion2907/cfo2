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
    <div className="space-y-6">
      {/* Net Worth Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Balance Sheet</h2>
          <div className={`text-4xl font-bold ${getNetWorthColor(balanceSheet.netWorth)} mb-2`}>
            {formatAmount(balanceSheet.netWorth)}
          </div>
          <div className="text-sm text-gray-600">
            Net Worth = Assets ({formatAmount(balanceSheet.assets.totalAssets)}) - Liabilities ({formatAmount(balanceSheet.liabilities.totalLiabilities)})
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Assets Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Assets</h3>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {formatAmount(balanceSheet.assets.totalAssets)}
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Stocks:</span>
              <span className="font-medium">{formatAmount(balanceSheet.assets.stocks.reduce((sum, stock) => sum + stock.currentValue, 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cash:</span>
              <span className="font-medium">{formatAmount(balanceSheet.assets.cash)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Other Assets:</span>
              <span className="font-medium">{formatAmount(balanceSheet.assets.otherAssets)}</span>
            </div>
          </div>
        </div>

        {/* Liabilities Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Liabilities</h3>
            <CreditCard className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600">
            {formatAmount(balanceSheet.liabilities.totalLiabilities)}
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Loans:</span>
              <span className="font-medium">{formatAmount(balanceSheet.liabilities.loans.reduce((sum, loan) => sum + loan.currentBalance, 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Credit Cards:</span>
              <span className="font-medium">{formatAmount(balanceSheet.liabilities.creditCards.reduce((sum, card) => sum + card.currentBalance, 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Other:</span>
              <span className="font-medium">{formatAmount(balanceSheet.liabilities.otherLiabilities)}</span>
            </div>
          </div>
        </div>

        {/* Financial Health Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Financial Health</h3>
            {getNetWorthIcon(balanceSheet.netWorth)}
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Debt-to-Asset Ratio:</span>
                <span className={`font-medium ${getDebtToAssetColor(getDebtToAssetRatio())}`}>
                  {getDebtToAssetRatio().toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getDebtToAssetColor(getDebtToAssetRatio()).replace('text-', 'bg-')}`}
                  style={{ width: `${Math.min(getDebtToAssetRatio(), 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {getDebtToAssetRatio() <= 30 ? 'Excellent financial health' : 
               getDebtToAssetRatio() <= 50 ? 'Good financial health' : 
               'Consider reducing debt'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-900">View All Assets</div>
            <div className="text-xs text-gray-600">Stocks, FDs, Gold, etc.</div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-900">View Liabilities</div>
            <div className="text-xs text-gray-600">Loans, credit cards</div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-900">View Transactions</div>
            <div className="text-xs text-gray-600">All financial activity</div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-sm font-medium text-gray-900">Add New Item</div>
            <div className="text-xs text-gray-600">Asset or liability</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetSummary;