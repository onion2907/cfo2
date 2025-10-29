import React from 'react';
import { Asset, Holding } from '../types/portfolio';
import { formatCurrency } from '../utils/currency';
import { Plus, TrendingUp } from 'lucide-react';
import HoldingsTable from './HoldingsTable';
import AssetsTable from './AssetsTable';

interface ComprehensiveAssetsViewProps {
  holdings: Holding[];
  assets: Asset[];
  displayCurrency?: string;
  onEditHolding: (holding: Holding) => void;
  onDeleteHolding: (holding: Holding) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (asset: Asset) => void;
  onAddAsset: () => void;
  onAddTransaction: () => void;
}

const ComprehensiveAssetsView: React.FC<ComprehensiveAssetsViewProps> = ({
  holdings,
  assets,
  displayCurrency = 'INR',
  onEditHolding,
  onDeleteHolding,
  onEditAsset,
  onDeleteAsset,
  onAddAsset,
  onAddTransaction
}) => {
  const formatAmount = (amount: number) => formatCurrency(amount, displayCurrency);

  // Calculate totals
  const totalStockValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalStockCost = holdings.reduce((sum, holding) => sum + (holding.averageCost * holding.totalQuantity), 0);
  const totalStockGainLoss = totalStockValue - totalStockCost;
  const totalStockGainLossPercent = totalStockCost > 0 ? (totalStockGainLoss / totalStockCost) * 100 : 0;

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalAssetCost = assets.reduce((sum, asset) => {
    // Use appropriate cost field based on asset type
    return sum + (asset.principalAmount || asset.monthlyDepositAmount || asset.faceValue || asset.purchasePrice || asset.currentValue || 0);
  }, 0);
  const totalAssetGainLoss = totalAssetValue - totalAssetCost;
  const totalAssetGainLossPercent = totalAssetCost > 0 ? (totalAssetGainLoss / totalAssetCost) * 100 : 0;

  const totalAssetsValue = totalStockValue + totalAssetValue;
  const totalAssetsCost = totalStockCost + totalAssetCost;
  const totalAssetsGainLoss = totalAssetsValue - totalAssetsCost;
  const totalAssetsGainLossPercent = totalAssetsCost > 0 ? (totalAssetsGainLoss / totalAssetsCost) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Assets</div>
          <div className="text-2xl font-bold text-gray-900">{holdings.length + assets.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Investment</div>
          <div className="text-2xl font-bold text-gray-900">{formatAmount(totalAssetsCost)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Current Value</div>
          <div className="text-2xl font-bold text-gray-900">{formatAmount(totalAssetsValue)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Profit/Loss</div>
          <div className={`text-2xl font-bold ${totalAssetsGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatAmount(totalAssetsGainLoss)} ({totalAssetsGainLossPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onAddTransaction}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Stock Transaction</span>
        </button>
        <button
          onClick={onAddAsset}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Stock Holdings Section */}
      {holdings.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Stock Holdings</h3>
                  <p className="text-sm text-gray-600">{holdings.length} stock{holdings.length !== 1 ? 's' : ''} • {formatAmount(totalStockValue)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${totalStockGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatAmount(totalStockGainLoss)} ({totalStockGainLossPercent.toFixed(2)}%)
                </div>
                <div className="text-sm text-gray-600">P&L</div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <HoldingsTable
              holdings={holdings}
              displayCurrency={displayCurrency}
              onEditHolding={onEditHolding}
              onViewTransactions={() => {}} // Not needed in this context
              onDeleteHolding={onDeleteHolding}
            />
          </div>
        </div>
      )}

      {/* Other Assets Section */}
      {assets.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Other Assets</h3>
                  <p className="text-sm text-gray-600">{assets.length} asset{assets.length !== 1 ? 's' : ''} • {formatAmount(totalAssetValue)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${totalAssetGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatAmount(totalAssetGainLoss)} ({totalAssetGainLossPercent.toFixed(2)}%)
                </div>
                <div className="text-sm text-gray-600">P&L</div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <AssetsTable
              assets={assets}
              displayCurrency={displayCurrency}
              onEditAsset={onEditAsset}
              onDeleteAsset={onDeleteAsset}
              onAddAsset={onAddAsset}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {holdings.length === 0 && assets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No assets added yet</div>
          <div className="flex justify-center space-x-3">
            <button
              onClick={onAddTransaction}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stock Transaction</span>
            </button>
            <button
              onClick={onAddAsset}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Asset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveAssetsView;
