import React, { useState, useEffect } from 'react';
import { X, Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useStockSearch } from '../hooks/useStockSearch';

interface AddStockModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (stock: {
    symbol: string;
    name: string;
    shares: number;
    purchasePrice: number;
    currentPrice: number;
    purchaseDate: string;
  }) => void;
}

const AddStockModalV2: React.FC<AddStockModalV2Props> = ({ isOpen, onClose, onAddStock }) => {
  const {
    searchQuery,
    searchResults,
    selectedStock,
    stockQuote,
    isLoading,
    error,
    setSearchQuery,
    selectStock,
    clearSearch,
    fetchQuote
  } = useStockSearch();

  const [formData, setFormData] = useState({
    shares: '',
    purchasePrice: '',
    purchaseDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch quote when a stock is selected
  useEffect(() => {
    if (selectedStock) {
      fetchQuote(selectedStock.symbol);
    }
  }, [selectedStock, fetchQuote]);

  // Auto-populate current price when quote is available
  useEffect(() => {
    if (stockQuote && !formData.purchasePrice) {
      setFormData(prev => ({
        ...prev,
        purchasePrice: stockQuote.price.toFixed(2)
      }));
    }
  }, [stockQuote]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedStock) {
      newErrors.symbol = 'Please select a stock';
    }

    if (!formData.shares || isNaN(Number(formData.shares)) || Number(formData.shares) <= 0) {
      newErrors.shares = 'Valid number of shares is required';
    }

    if (!formData.purchasePrice || isNaN(Number(formData.purchasePrice)) || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Valid purchase price is required';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && selectedStock && stockQuote) {
      onAddStock({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        shares: Number(formData.shares),
        purchasePrice: Number(formData.purchasePrice),
        currentPrice: stockQuote.price,
        purchaseDate: formData.purchaseDate
      });
      
      // Reset form
      setFormData({
        shares: '',
        purchasePrice: '',
        purchaseDate: ''
      });
      clearSearch();
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      shares: '',
      purchasePrice: '',
      purchaseDate: ''
    });
    setErrors({});
    clearSearch();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Stock</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Stock Search */}
          <div>
            <label htmlFor="stockSearch" className="block text-sm font-medium text-gray-700 mb-1">
              Search Stock *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="stockSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by symbol or company name..."
              />
              {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                </div>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg shadow-lg bg-white max-h-48 overflow-y-auto">
                {searchResults.map((stock, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectStock(stock)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-600 truncate">{stock.name}</div>
                        <div className="text-xs text-gray-500">{stock.region} • {stock.type}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Stock Display */}
            {selectedStock && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{selectedStock.symbol}</div>
                    <div className="text-sm text-gray-600">{selectedStock.name}</div>
                  </div>
                  {stockQuote && (
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${stockQuote.price.toFixed(2)}
                      </div>
                      <div className={`text-sm flex items-center ${
                        stockQuote.change >= 0 ? 'text-success-600' : 'text-danger-600'
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
              <p className="mt-1 text-sm text-danger-600">{errors.symbol}</p>
            )}
            {error && (
              <p className="mt-1 text-sm text-danger-600">{error}</p>
            )}
          </div>

          {/* Number of Shares */}
          <div>
            <label htmlFor="shares" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Shares *
            </label>
            <input
              type="number"
              id="shares"
              name="shares"
              value={formData.shares}
              onChange={handleInputChange}
              className={`input-field ${errors.shares ? 'border-danger-500' : ''}`}
              placeholder="e.g., 100"
              min="0"
              step="0.01"
            />
            {errors.shares && (
              <p className="mt-1 text-sm text-danger-600">{errors.shares}</p>
            )}
          </div>

          {/* Purchase Price */}
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price per Share *
            </label>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleInputChange}
              className={`input-field ${errors.purchasePrice ? 'border-danger-500' : ''}`}
              placeholder="e.g., 150.00"
              min="0"
              step="0.01"
            />
            {stockQuote && (
              <p className="mt-1 text-xs text-gray-500">
                Current price: ${stockQuote.price.toFixed(2)}
              </p>
            )}
            {errors.purchasePrice && (
              <p className="mt-1 text-sm text-danger-600">{errors.purchasePrice}</p>
            )}
          </div>

          {/* Purchase Date */}
          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date *
            </label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              className={`input-field ${errors.purchaseDate ? 'border-danger-500' : ''}`}
            />
            {errors.purchaseDate && (
              <p className="mt-1 text-sm text-danger-600">{errors.purchaseDate}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!selectedStock || isLoading}
            >
              {isLoading ? 'Loading...' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModalV2;
