import React from 'react';
import { Holding } from '../types/portfolio';
import { formatCurrency } from '../utils/currency';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';

interface HoldingsTableProps {
  holdings: Holding[];
  displayCurrency?: string;
  onEditHolding?: (holding: Holding) => void;
  onViewTransactions?: (holding: Holding) => void;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  displayCurrency = 'USD',
  onEditHolding,
  onViewTransactions
}) => {
  const formatAmount = (amount: number, currency: string = displayCurrency) => {
    return formatCurrency(amount, currency);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };


  if (holdings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Holdings</h3>
          <p className="text-gray-500">Start by adding some transactions to see your holdings here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instrument
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                LTP
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cur. val
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                P&L
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net chg.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Day chg.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdings.map((holding) => (
              <tr key={holding.symbol} className="hover:bg-gray-50">
                {/* Instrument */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {holding.symbol}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-32">
                        {holding.name}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Quantity */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {holding.totalQuantity.toLocaleString()}
                </td>

                {/* Average Cost */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatAmount(holding.averageCost, holding.currency)}
                </td>

                {/* Last Traded Price */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatAmount(holding.lastTradedPrice, holding.currency)}
                </td>

                {/* Current Value */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {formatAmount(holding.currentValue, holding.currency)}
                </td>

                {/* P&L */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className={`font-medium ${getChangeColor(holding.profitLoss)}`}>
                    {formatAmount(holding.profitLoss, holding.currency)}
                  </span>
                </td>

                {/* Net Change */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end">
                    {holding.profitLossPercent !== 0 && (
                      holding.profitLossPercent > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )
                    )}
                    <span className={`font-medium ${getChangeColor(holding.profitLossPercent)}`}>
                      {formatPercentage(holding.profitLossPercent)}
                    </span>
                  </div>
                </td>

                {/* Day Change */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end">
                    {holding.dayChangePercent !== 0 && (
                      holding.dayChangePercent > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )
                    )}
                    <span className={`font-medium ${getChangeColor(holding.dayChangePercent)}`}>
                      {formatPercentage(holding.dayChangePercent)}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onViewTransactions?.(holding)}
                      className="text-indigo-600 hover:text-indigo-900 text-xs"
                    >
                      View Txns
                    </button>
                    <button
                      onClick={() => onEditHolding?.(holding)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;
