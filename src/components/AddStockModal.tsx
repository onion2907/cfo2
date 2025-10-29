import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddStockModalProps {
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

const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onAddStock }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    shares: '',
    purchasePrice: '',
    currentPrice: '',
    purchaseDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.shares || isNaN(Number(formData.shares)) || Number(formData.shares) <= 0) {
      newErrors.shares = 'Valid number of shares is required';
    }

    if (!formData.purchasePrice || isNaN(Number(formData.purchasePrice)) || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Valid purchase price is required';
    }

    if (!formData.currentPrice || isNaN(Number(formData.currentPrice)) || Number(formData.currentPrice) <= 0) {
      newErrors.currentPrice = 'Valid current price is required';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddStock({
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        shares: Number(formData.shares),
        purchasePrice: Number(formData.purchasePrice),
        currentPrice: Number(formData.currentPrice),
        purchaseDate: formData.purchaseDate
      });
      
      // Reset form
      setFormData({
        symbol: '',
        name: '',
        shares: '',
        purchasePrice: '',
        currentPrice: '',
        purchaseDate: ''
      });
      
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      symbol: '',
      name: '',
      shares: '',
      purchasePrice: '',
      currentPrice: '',
      purchaseDate: ''
    });
    setErrors({});
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
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Symbol *
            </label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              className={`input-field ${errors.symbol ? 'border-danger-500' : ''}`}
              placeholder="e.g., AAPL"
            />
            {errors.symbol && (
              <p className="mt-1 text-sm text-danger-600">{errors.symbol}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input-field ${errors.name ? 'border-danger-500' : ''}`}
              placeholder="e.g., Apple Inc."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
            )}
          </div>

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
            {errors.purchasePrice && (
              <p className="mt-1 text-sm text-danger-600">{errors.purchasePrice}</p>
            )}
          </div>

          <div>
            <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Current Price per Share *
            </label>
            <input
              type="number"
              id="currentPrice"
              name="currentPrice"
              value={formData.currentPrice}
              onChange={handleInputChange}
              className={`input-field ${errors.currentPrice ? 'border-danger-500' : ''}`}
              placeholder="e.g., 175.00"
              min="0"
              step="0.01"
            />
            {errors.currentPrice && (
              <p className="mt-1 text-sm text-danger-600">{errors.currentPrice}</p>
            )}
          </div>

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
            >
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;
