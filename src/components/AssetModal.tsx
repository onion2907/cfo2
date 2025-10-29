import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Asset, AssetType } from '../types/portfolio';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsset: (asset: Omit<Asset, 'id'>) => void;
  editingAsset: Asset | null;
}

const ASSET_TYPES: { value: AssetType; label: string; icon: string }[] = [
  { value: 'FIXED_DEPOSIT', label: 'Fixed Deposit', icon: '🏦' },
  { value: 'RECURRING_DEPOSIT', label: 'Recurring Deposit', icon: '💳' },
  { value: 'GOLD', label: 'Gold', icon: '🥇' },
  { value: 'SILVER', label: 'Silver', icon: '🥈' },
  { value: 'JEWELS', label: 'Jewels', icon: '💎' },
  { value: 'BONDS', label: 'Bonds', icon: '📄' },
  { value: 'REAL_ESTATE', label: 'Real Estate', icon: '🏠' },
  { value: 'PROVIDENT_FUND', label: 'Provident Fund', icon: '🏛️' },
  { value: 'PENSION_FUND', label: 'Pension Fund', icon: '👴' },
  { value: 'MUTUAL_FUNDS', label: 'Mutual Funds', icon: '📈' },
  { value: 'RECEIVABLES', label: 'Receivables', icon: '💰' }
];

const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  onSaveAsset,
  editingAsset
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'FIXED_DEPOSIT' as AssetType,
    amount: '',
    description: '',
    purchaseDate: '',
    maturityDate: '',
    interestRate: '',
    currentValue: '',
    isActive: true,
    // Type-specific fields
    bankName: '',
    accountNumber: '',
    weight: '',
    purity: '',
    propertyAddress: '',
    propertyType: '',
    fundName: '',
    fundHouse: '',
    nav: '',
    units: '',
    dueDate: '',
    debtorName: ''
  });

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        name: editingAsset.name,
        type: editingAsset.type,
        amount: editingAsset.amount.toString(),
        description: editingAsset.description || '',
        purchaseDate: editingAsset.purchaseDate || '',
        maturityDate: editingAsset.maturityDate || '',
        interestRate: editingAsset.interestRate?.toString() || '',
        currentValue: editingAsset.currentValue?.toString() || '',
        isActive: editingAsset.isActive,
        bankName: editingAsset.bankName || '',
        accountNumber: editingAsset.accountNumber || '',
        weight: editingAsset.weight?.toString() || '',
        purity: editingAsset.purity || '',
        propertyAddress: editingAsset.propertyAddress || '',
        propertyType: editingAsset.propertyType || '',
        fundName: editingAsset.fundName || '',
        fundHouse: editingAsset.fundHouse || '',
        nav: editingAsset.nav?.toString() || '',
        units: editingAsset.units?.toString() || '',
        dueDate: editingAsset.dueDate || '',
        debtorName: editingAsset.debtorName || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'FIXED_DEPOSIT',
        amount: '',
        description: '',
        purchaseDate: '',
        maturityDate: '',
        interestRate: '',
        currentValue: '',
        isActive: true,
        bankName: '',
        accountNumber: '',
        weight: '',
        purity: '',
        propertyAddress: '',
        propertyType: '',
        fundName: '',
        fundHouse: '',
        nav: '',
        units: '',
        dueDate: '',
        debtorName: ''
      });
    }
  }, [editingAsset, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.amount) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 0) {
      return;
    }

    const assetData: Omit<Asset, 'id'> = {
      name: formData.name.trim(),
      type: formData.type,
      amount: amount,
      currency: 'INR',
      description: formData.description.trim() || undefined,
      purchaseDate: formData.purchaseDate || undefined,
      maturityDate: formData.maturityDate || undefined,
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
      currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
      isActive: formData.isActive,
      lastUpdated: new Date().toISOString(),
      // Type-specific fields
      bankName: formData.bankName.trim() || undefined,
      accountNumber: formData.accountNumber.trim() || undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      purity: formData.purity.trim() || undefined,
      propertyAddress: formData.propertyAddress.trim() || undefined,
      propertyType: formData.propertyType.trim() || undefined,
      fundName: formData.fundName.trim() || undefined,
      fundHouse: formData.fundHouse.trim() || undefined,
      nav: formData.nav ? parseFloat(formData.nav) : undefined,
      units: formData.units ? parseFloat(formData.units) : undefined,
      dueDate: formData.dueDate || undefined,
      debtorName: formData.debtorName.trim() || undefined
    };

    onSaveAsset(assetData);
    onClose();
  };

  const getFieldsForAssetType = (type: AssetType) => {
    switch (type) {
      case 'FIXED_DEPOSIT':
      case 'RECURRING_DEPOSIT':
        return (
          <>
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter bank name"
              />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter account number"
              />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                id="interestRate"
                value={formData.interestRate}
                onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter interest rate"
                step="0.01"
              />
            </div>
          </>
        );
      
      case 'GOLD':
      case 'SILVER':
      case 'JEWELS':
        return (
          <>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (grams)
              </label>
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter weight in grams"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="purity" className="block text-sm font-medium text-gray-700 mb-1">
                Purity
              </label>
              <input
                type="text"
                id="purity"
                value={formData.purity}
                onChange={(e) => setFormData(prev => ({ ...prev, purity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 24K, 999, 18K"
              />
            </div>
          </>
        );
      
      case 'REAL_ESTATE':
        return (
          <>
            <div>
              <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Property Address
              </label>
              <textarea
                id="propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, propertyAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter property address"
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select property type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
              </select>
            </div>
          </>
        );
      
      case 'MUTUAL_FUNDS':
        return (
          <>
            <div>
              <label htmlFor="fundName" className="block text-sm font-medium text-gray-700 mb-1">
                Fund Name
              </label>
              <input
                type="text"
                id="fundName"
                value={formData.fundName}
                onChange={(e) => setFormData(prev => ({ ...prev, fundName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter fund name"
              />
            </div>
            <div>
              <label htmlFor="fundHouse" className="block text-sm font-medium text-gray-700 mb-1">
                Fund House
              </label>
              <input
                type="text"
                id="fundHouse"
                value={formData.fundHouse}
                onChange={(e) => setFormData(prev => ({ ...prev, fundHouse: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter fund house"
              />
            </div>
            <div>
              <label htmlFor="nav" className="block text-sm font-medium text-gray-700 mb-1">
                NAV (Net Asset Value)
              </label>
              <input
                type="number"
                id="nav"
                value={formData.nav}
                onChange={(e) => setFormData(prev => ({ ...prev, nav: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter NAV"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                Units
              </label>
              <input
                type="number"
                id="units"
                value={formData.units}
                onChange={(e) => setFormData(prev => ({ ...prev, units: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter number of units"
                step="0.01"
              />
            </div>
          </>
        );
      
      case 'PROVIDENT_FUND':
      case 'PENSION_FUND':
        return (
          <>
            <div>
              <label htmlFor="fundName" className="block text-sm font-medium text-gray-700 mb-1">
                Fund Name
              </label>
              <input
                type="text"
                id="fundName"
                value={formData.fundName}
                onChange={(e) => setFormData(prev => ({ ...prev, fundName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter fund name"
              />
            </div>
          </>
        );
      
      case 'RECEIVABLES':
        return (
          <>
            <div>
              <label htmlFor="debtorName" className="block text-sm font-medium text-gray-700 mb-1">
                Debtor Name
              </label>
              <input
                type="text"
                id="debtorName"
                value={formData.debtorName}
                onChange={(e) => setFormData(prev => ({ ...prev, debtorName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter debtor name"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingAsset ? 'Edit Asset' : 'Add Asset'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Asset Type Selection */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Asset Type *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AssetType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              {ASSET_TYPES.map((assetType) => (
                <option key={assetType.value} value={assetType.value}>
                  {assetType.icon} {assetType.label}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Asset Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter asset name"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Type-specific Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFieldsForAssetType(formData.type)}
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                id="purchaseDate"
                value={formData.purchaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="maturityDate" className="block text-sm font-medium text-gray-700 mb-1">
                Maturity Date
              </label>
              <input
                type="date"
                id="maturityDate"
                value={formData.maturityDate}
                onChange={(e) => setFormData(prev => ({ ...prev, maturityDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 mb-1">
              Current Value (₹)
            </label>
            <input
              type="number"
              id="currentValue"
              value={formData.currentValue}
              onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter current value (optional)"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              {editingAsset ? 'Update Asset' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;
