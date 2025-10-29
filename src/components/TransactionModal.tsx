import React, { useState, useEffect } from 'react';
import { X, Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useStockSearch } from '../hooks/useStockSearch';
import { formatCurrency } from '../utils/currency';
import { Transaction } from '../types/portfolio';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editingTransaction?: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSaveTransaction,
  editingTransaction
}) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedStock,
    selectStock,
    stockQuote,
    isLoading,
    error
  } = useStockSearch();

  const [formData, setFormData] = useState({
    type: 'BUY' as 'BUY' | 'SELL',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or when editing transaction changes
  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setFormData({
          type: editingTransaction.type,
          quantity: editingTransaction.quantity.toString(),
          price: editingTransaction.price.toString(),
          date: editingTransaction.date,
          notes: editingTransaction.notes || ''
        });
        // Set the selected stock for editing
        selectStock({
          symbol: editingTransaction.symbol,
          name: editingTransaction.name,
          type: 'Equity',
          region: 'US',
          marketOpen: '09:30',
          marketClose: '16:00',
          timezone: 'UTC-05',
          currency: editingTransaction.currency,
          matchScore: '1.0000'
        });
      } else {
        setFormData({
          type: 'BUY',
          quantity: '',
          price: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        setSearchQuery('');
        selectStock(null);
      }
      setErrors({});
    }
  }, [isOpen, editingTransaction, selectStock]);

  // Auto-fill current price when stock is selected
  useEffect(() => {
    if (stockQuote && !editingTransaction) {
      setFormData(prev => ({
        ...prev,
        price: stockQuote.price.toString()
      }));
    }
  }, [stockQuote, editingTransaction]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedStock) {
      newErrors.symbol = 'Please select a stock';
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && selectedStock && stockQuote) {
      onSaveTransaction({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        type: formData.type,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        date: formData.date,
        currency: stockQuote.currency,
        notes: formData.notes || undefined
      });
      
      // Reset form
      setFormData({
        type: 'BUY',
        quantity: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setSearchQuery('');
      selectStock(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="BUY"
                  checked={formData.type === 'BUY'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'BUY' | 'SELL' }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Buy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="SELL"
                  checked={formData.type === 'SELL'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'BUY' | 'SELL' }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Sell</span>
              </label>
            </div>
          </div>

          {/* Stock Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Symbol
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search for stocks (e.g., AAPL, RELIANCE.BSE)"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-md bg-white shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((stock) => (
                  <button
                    key={stock.symbol}
                    type="button"
                    onClick={() => selectStock(stock)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">{stock.name}</div>
                      </div>
                      <div className="text-sm text-gray-500">{stock.region}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Stock */}
            {selectedStock && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{selectedStock.symbol}</div>
                    <div className="text-sm text-gray-500">{selectedStock.name}</div>
                  </div>
                  {stockQuote && (
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(stockQuote.price, stockQuote.currency)}
                      </div>
                      <div className={`text-sm flex items-center ${
                        stockQuote.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stockQuote.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {stockQuote.changePercent}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {errors.symbol && (
              <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>
            )}
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 100"
                min="0"
                step="1"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Share
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 150.00"
                min="0"
                step="0.01"
              />
              {stockQuote && (
                <p className="mt-1 text-xs text-gray-500">
                  Current price: {formatCurrency(stockQuote.price, stockQuote.currency)}
                </p>
              )}
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add any notes about this transaction..."
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
