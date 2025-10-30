import React from 'react';
import { Asset, AssetType } from '../types/portfolio';
import { formatCurrency } from '../utils/currency';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface AssetsTableProps {
  assets: Asset[];
  displayCurrency?: string;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (asset: Asset) => void;
  onAddAsset: () => void;
}

const ASSET_TYPE_LABELS: Record<AssetType, { label: string; icon: string; color: string }> = {
  FIXED_DEPOSIT: { label: 'Fixed Deposit', icon: '🏦', color: 'bg-blue-100 text-blue-800' },
  RECURRING_DEPOSIT: { label: 'Recurring Deposit', icon: '💳', color: 'bg-blue-100 text-blue-800' },
  BONDS: { label: 'Bonds', icon: '📄', color: 'bg-green-100 text-green-800' },
  MUTUAL_FUNDS: { label: 'Mutual Funds', icon: '📈', color: 'bg-emerald-100 text-emerald-800' },
  GOLD: { label: 'Gold', icon: '🥇', color: 'bg-yellow-100 text-yellow-800' },
  SILVER: { label: 'Silver', icon: '🥈', color: 'bg-gray-100 text-gray-800' },
  JEWELS: { label: 'Jewels', icon: '💎', color: 'bg-purple-100 text-purple-800' },
  REAL_ESTATE: { label: 'Real Estate', icon: '🏠', color: 'bg-orange-100 text-orange-800' },
  PROVIDENT_FUND: { label: 'Provident Fund', icon: '🏛️', color: 'bg-indigo-100 text-indigo-800' },
  PENSION_FUND: { label: 'Pension Fund', icon: '👴', color: 'bg-indigo-100 text-indigo-800' },
  RECEIVABLES: { label: 'Receivables', icon: '💰', color: 'bg-pink-100 text-pink-800' },
  STOCKS: { label: 'Stocks', icon: '📊', color: 'bg-cyan-100 text-cyan-800' },
  INSURANCE_LINKED: { label: 'Insurance-Linked Assets', icon: '🛡️', color: 'bg-teal-100 text-teal-800' },
  CASH_BANK: { label: 'Cash & Bank Balances', icon: '💵', color: 'bg-lime-100 text-lime-800' }
};

const AssetsTable: React.FC<AssetsTableProps> = ({
  assets,
  displayCurrency = 'INR',
  onEditAsset,
  onDeleteAsset,
  onAddAsset
}) => {
  const formatAmount = (amount: number) => formatCurrency(amount, displayCurrency);

  const getAssetTypeInfo = (type: AssetType) => {
    return ASSET_TYPE_LABELS[type] || { label: type, icon: '📦', color: 'bg-gray-100 text-gray-800' };
  };

  const getAssetDetails = (asset: Asset) => {
    switch (asset.type) {
      case 'FIXED_DEPOSIT':
      case 'RECURRING_DEPOSIT':
        return asset.bankName ? `${asset.bankName}${asset.accountNumber ? ` (${asset.accountNumber})` : ''}` : '';
      case 'GOLD':
      case 'SILVER':
      case 'JEWELS':
        return asset.weight ? `${asset.weight}g${asset.purity ? ` (${asset.purity})` : ''}` : '';
      case 'REAL_ESTATE':
        return asset.propertyType ? `${asset.propertyType}${asset.propertyAddress ? ` - ${asset.propertyAddress.substring(0, 30)}${asset.propertyAddress.length > 30 ? '...' : ''}` : ''}` : '';
      case 'MUTUAL_FUNDS':
        return asset.fundName ? `${asset.fundName}${asset.fundHouse ? ` (${asset.fundHouse})` : ''}` : '';
      case 'PROVIDENT_FUND':
      case 'PENSION_FUND':
        return asset.fundName || '';
      case 'RECEIVABLES':
        return asset.debtorName ? `From: ${asset.debtorName}` : '';
      default:
        return asset.description || '';
    }
  };

  const getCurrentValue = (asset: Asset) => {
    return asset.currentValue;
  };

  const getCostValue = (asset: Asset) => {
    // Use appropriate cost field based on asset type
    if ((asset.type === 'GOLD' || asset.type === 'SILVER') && typeof asset.purchaseRate === 'number' && typeof asset.quantity === 'number') {
      return asset.purchaseRate * asset.quantity;
    }
    return asset.principalAmount || asset.monthlyDepositAmount || asset.faceValue || asset.purchasePrice || asset.currentValue || 0;
  };

  const getProfitLoss = (asset: Asset) => {
    const costValue = getCostValue(asset);
    if (asset.currentValue && asset.currentValue !== costValue) {
      return asset.currentValue - costValue;
    }
    return 0;
  };

  const getProfitLossPercent = (asset: Asset) => {
    const profitLoss = getProfitLoss(asset);
    const costValue = getCostValue(asset);
    return costValue > 0 ? (profitLoss / costValue) * 100 : 0;
  };

  // Group assets by type
  const groupedAssets = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = [];
    }
    acc[asset.type].push(asset);
    return acc;
  }, {} as Record<AssetType, Asset[]>);

  // Calculate totals for each type
  const typeTotals = Object.entries(groupedAssets).map(([type, assets]) => {
    const totalAmount = assets.reduce((sum, asset) => sum + getCostValue(asset), 0);
    const totalCurrentValue = assets.reduce((sum, asset) => sum + getCurrentValue(asset), 0);
    const totalProfitLoss = totalCurrentValue - totalAmount;
    const totalProfitLossPercent = totalAmount > 0 ? (totalProfitLoss / totalAmount) * 100 : 0;

    return {
      type: type as AssetType,
      count: assets.length,
      totalAmount,
      totalCurrentValue,
      totalProfitLoss,
      totalProfitLossPercent
    };
  });

  const totalAssets = assets.length;
  const totalAmount = assets.reduce((sum, asset) => sum + getCostValue(asset), 0);
  const totalCurrentValue = assets.reduce((sum, asset) => sum + getCurrentValue(asset), 0);
  const totalProfitLoss = totalCurrentValue - totalAmount;
  const totalProfitLossPercent = totalAmount > 0 ? (totalProfitLoss / totalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Assets</div>
          <div className="text-2xl font-bold text-gray-900">{totalAssets}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Investment</div>
          <div className="text-2xl font-bold text-gray-900">{formatAmount(totalAmount)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Current Value</div>
          <div className="text-2xl font-bold text-gray-900">{formatAmount(totalCurrentValue)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Profit/Loss</div>
          <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatAmount(totalProfitLoss)} ({totalProfitLossPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Add Asset Button */}
      <div className="flex justify-end">
        <button
          onClick={onAddAsset}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Assets by Type */}
      {Object.entries(groupedAssets).map(([type, typeAssets]) => {
        const typeInfo = getAssetTypeInfo(type as AssetType);
        const typeTotal = typeTotals.find(t => t.type === type);
        
        return (
          <div key={type} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{typeInfo.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{typeInfo.label}</h3>
                    <p className="text-sm text-gray-600">{typeAssets.length} asset{typeAssets.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatAmount(typeTotal?.totalCurrentValue || 0)}
                  </div>
                  <div className={`text-sm ${(typeTotal?.totalProfitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatAmount(typeTotal?.totalProfitLoss || 0)} ({typeTotal?.totalProfitLossPercent?.toFixed(2) || 0}%)
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Investment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      P&L
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {typeAssets.map((asset) => {
                    const currentValue = getCurrentValue(asset);
                    const profitLoss = getProfitLoss(asset);
                    const profitLossPercent = getProfitLossPercent(asset);
                    const details = getAssetDetails(asset);

                    return (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                            {asset.description && (
                              <div className="text-sm text-gray-500">{asset.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{details}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatAmount(getCostValue(asset))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatAmount(currentValue)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatAmount(profitLoss)} ({profitLossPercent.toFixed(2)}%)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            asset.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {asset.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => onEditAsset(asset)}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Edit asset"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDeleteAsset(asset)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete asset"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {assets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No assets added yet</div>
          <button
            onClick={onAddAsset}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Your First Asset</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AssetsTable;
