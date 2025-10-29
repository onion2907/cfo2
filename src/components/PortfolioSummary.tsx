import React from 'react';
import { PortfolioMetrics } from '../types/portfolio';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface PortfolioSummaryProps {
  metrics: PortfolioMetrics;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ metrics }) => {
  const formatAmount = (amount: number) => {
    return formatCurrency(amount, 'USD'); // Portfolio summary in USD for now
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Portfolio Value */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatAmount(metrics.totalValue)}
            </p>
          </div>
          <div className="p-3 bg-primary-100 rounded-full">
            <DollarSign className="h-6 w-6 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Total Gain/Loss */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${
              metrics.totalGainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {formatAmount(metrics.totalGainLoss)}
            </p>
            <p className={`text-sm ${
              metrics.totalGainLossPercentage >= 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {formatPercentage(metrics.totalGainLossPercentage)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${
            metrics.totalGainLoss >= 0 ? 'bg-success-100' : 'bg-danger-100'
          }`}>
            {metrics.totalGainLoss >= 0 ? (
              <TrendingUp className="h-6 w-6 text-success-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-danger-600" />
            )}
          </div>
        </div>
      </div>

      {/* Day Change */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Day Change</p>
            <p className={`text-2xl font-bold ${
              metrics.dayChange >= 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {formatAmount(metrics.dayChange)}
            </p>
            <p className={`text-sm ${
              metrics.dayChangePercentage >= 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {formatPercentage(metrics.dayChangePercentage)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${
            metrics.dayChange >= 0 ? 'bg-success-100' : 'bg-danger-100'
          }`}>
            {metrics.dayChange >= 0 ? (
              <TrendingUp className="h-6 w-6 text-success-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-danger-600" />
            )}
          </div>
        </div>
      </div>

      {/* Total Cost */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Cost</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatAmount(metrics.totalCost)}
            </p>
          </div>
          <div className="p-3 bg-gray-100 rounded-full">
            <Percent className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
