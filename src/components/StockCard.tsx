import React from 'react';
import { Stock } from '../types/portfolio';
import { ConvertedStock } from '../services/currencyConversion';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface StockCardProps {
  stock: Stock | ConvertedStock;
  onEdit: (stock: Stock) => void;
  onRemove: (id: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onEdit, onRemove }) => {
  // Check if it's a converted stock
  const isConvertedStock = 'convertedPrice' in stock;
  
  const currentValue = isConvertedStock ? stock.convertedValue : stock.shares * stock.currentPrice;
  const costBasis = isConvertedStock ? stock.convertedCostBasis : stock.shares * stock.purchasePrice;
  const gainLoss = isConvertedStock ? stock.convertedGainLoss : currentValue - costBasis;
  const gainLossPercentage = (gainLoss / costBasis) * 100;
  
  const displayCurrency = isConvertedStock ? stock.displayCurrency : stock.currency;
  const currentPrice = isConvertedStock ? stock.convertedPrice : stock.currentPrice;
  const purchasePrice = isConvertedStock ? 
    (stock.convertedCostBasis / stock.shares) : stock.purchasePrice;

  const formatAmount = (amount: number) => {
    return formatCurrency(amount, displayCurrency);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{stock.symbol}</h3>
          <p className="text-sm text-gray-600 truncate">{stock.name}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              // Convert ConvertedStock back to Stock for editing
              const baseStock: Stock = {
                id: stock.id,
                symbol: stock.symbol,
                name: stock.name,
                shares: stock.shares,
                purchasePrice: stock.purchasePrice,
                currentPrice: stock.currentPrice,
                purchaseDate: stock.purchaseDate,
                currency: stock.currency,
                exchange: 'exchange' in stock ? stock.exchange : 'NSE',
                sector: 'sector' in stock ? stock.sector : undefined
              };
              onEdit(baseStock);
            }}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            title="Edit stock"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRemove(stock.id)}
            className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
            title="Remove stock"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stock Details */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Shares</span>
          <span className="text-sm font-medium">{stock.shares.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Purchase Price</span>
          <span className="text-sm font-medium">{formatAmount(purchasePrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Current Price</span>
          <span className="text-sm font-medium">{formatAmount(currentPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Purchase Date</span>
          <span className="text-sm font-medium">{formatDate(stock.purchaseDate)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Value and Performance */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Current Value</span>
          <span className="text-sm font-semibold">{formatAmount(currentValue)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Cost Basis</span>
          <span className="text-sm font-medium">{formatAmount(costBasis)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Gain/Loss</span>
          <div className="flex items-center space-x-2">
            {gainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-danger-600" />
            )}
            <div className="text-right">
              <div className={`text-sm font-semibold ${
                gainLoss >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatAmount(gainLoss)}
              </div>
              <div className={`text-xs ${
                gainLossPercentage >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatPercentage(gainLossPercentage)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
