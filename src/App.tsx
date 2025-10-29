import React, { useState, useEffect, useCallback } from 'react';
import { Portfolio, Transaction, Liability, Holding, Asset } from './types/portfolio';
import PortfolioSummary from './components/PortfolioSummary';
import LiabilitiesTable from './components/LiabilitiesTable';
import BalanceSheetSummary from './components/BalanceSheetSummary';
import TransactionModal from './components/TransactionModal';
import LiabilityModal from './components/LiabilityModal';
import AssetModal from './components/AssetModal';
import ComprehensiveAssetsView from './components/ComprehensiveAssetsView';
import ComprehensiveTransactionsView from './components/ComprehensiveTransactionsView';
import ConfirmDialog from './components/ConfirmDialog';
import { calculateHoldingsFromTransactions, calculatePortfolioMetrics, migrateOldPortfolio } from './utils/portfolioCalculations';
import { calculateBalanceSheet } from './utils/liabilityCalculations';
import { useRefresh } from './hooks/useRefresh';
// import { indianStockAPI } from './services/indianStockApi'; // Removed as not used directly in App.tsx
import { Plus, TrendingUp, CreditCard, DollarSign, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'stock-portfolio';
const LIABILITIES_STORAGE_KEY = 'liabilities';
const ASSETS_STORAGE_KEY = 'assets';

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    holdings: [],
    transactions: [],
    assets: [],
    metrics: {
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercentage: 0,
      dayChange: 0,
      dayChangePercentage: 0
    }
  });
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [cash, setCash] = useState<number>(0);
  const [otherAssets, setOtherAssets] = useState<number>(0);
  const [otherLiabilities, setOtherLiabilities] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'balance-sheet' | 'assets' | 'liabilities' | 'transactions'>('balance-sheet');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isLiabilityModalOpen, setIsLiabilityModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingLiability, setEditingLiability] = useState<Liability | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  // Focus on INR currency only
  const selectedCurrency = 'INR';

  // Refresh functionality
  const {
    isRefreshing,
    refreshError,
    refreshPortfolio,
    refreshAllData,
    hasStaleData,
    initializeRefreshTime
  } = useRefresh();

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem(STORAGE_KEY);
    if (savedPortfolio) {
      try {
        const parsedPortfolio = JSON.parse(savedPortfolio);
        
        // Check if it's the old format and migrate
        if (parsedPortfolio.stocks && !parsedPortfolio.holdings) {
          const { holdings, transactions } = migrateOldPortfolio(parsedPortfolio.stocks);
          const metrics = calculatePortfolioMetrics(holdings);
          setPortfolio({ 
            holdings, 
            transactions, 
            assets: [],
            metrics,
            lastUpdated: new Date().toISOString(),
            lastRefreshTime: parsedPortfolio.lastRefreshTime || new Date().toISOString()
          });
        } else {
          // Ensure timestamps are present
          setPortfolio({
            ...parsedPortfolio,
            assets: parsedPortfolio.assets || [],
            lastUpdated: parsedPortfolio.lastUpdated || new Date().toISOString(),
            lastRefreshTime: parsedPortfolio.lastRefreshTime || new Date().toISOString()
          });
          
          // Initialize refresh hook with saved refresh time
          if (parsedPortfolio.lastRefreshTime) {
            initializeRefreshTime(parsedPortfolio.lastRefreshTime);
          }
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
      }
    }

    // Load liabilities from localStorage
    const savedLiabilities = localStorage.getItem(LIABILITIES_STORAGE_KEY);
    if (savedLiabilities) {
      try {
        const parsedLiabilities = JSON.parse(savedLiabilities);
        setLiabilities(parsedLiabilities);
      } catch (error) {
        console.error('Error loading liabilities:', error);
      }
    }

    // Load other financial data
    const savedCash = localStorage.getItem('cash');
    if (savedCash) {
      setCash(parseFloat(savedCash));
    }

    const savedOtherAssets = localStorage.getItem('otherAssets');
    if (savedOtherAssets) {
      setOtherAssets(parseFloat(savedOtherAssets));
    }

    const savedOtherLiabilities = localStorage.getItem('otherLiabilities');
    if (savedOtherLiabilities) {
      setOtherLiabilities(parseFloat(savedOtherLiabilities));
    }

    // Load assets
    const savedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (savedAssets) {
      try {
        const parsedAssets = JSON.parse(savedAssets);
        setPortfolio(prev => ({ ...prev, assets: parsedAssets }));
      } catch (error) {
        console.error('Error loading assets:', error);
      }
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    const portfolioWithTimestamp = {
      ...portfolio,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioWithTimestamp));
  }, [portfolio]);

  // Save liabilities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LIABILITIES_STORAGE_KEY, JSON.stringify(liabilities));
  }, [liabilities]);

  // Save other financial data to localStorage
  useEffect(() => {
    localStorage.setItem('cash', cash.toString());
  }, [cash]);

  useEffect(() => {
    localStorage.setItem('otherAssets', otherAssets.toString());
  }, [otherAssets]);

  useEffect(() => {
    localStorage.setItem('otherLiabilities', otherLiabilities.toString());
  }, [otherLiabilities]);

  // Save assets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(portfolio.assets));
  }, [portfolio.assets]);

  // Recalculate holdings and metrics when transactions change
  useEffect(() => {
    const holdings = calculateHoldingsFromTransactions(portfolio.transactions);
    const metrics = calculatePortfolioMetrics(holdings);
    setPortfolio(prev => ({ ...prev, holdings, metrics }));
  }, [portfolio.transactions]);

  // Check if data is stale (older than 1 hour)
  const checkDataStaleness = useCallback(() => {
    if (portfolio.lastRefreshTime) {
      const lastRefresh = new Date(portfolio.lastRefreshTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 1; // Consider data stale after 1 hour
    }
    return false;
  }, [portfolio.lastRefreshTime]);

  // Check for stale data on mount and when portfolio changes
  useEffect(() => {
    const isStale = checkDataStaleness();
    if (isStale) {
      console.log('Data is stale - user should refresh');
    }
  }, [checkDataStaleness]);

  // Note: Removed automatic price fetching on mount to preserve saved data
  // Prices will only be updated when user explicitly clicks refresh button

  // Calculate balance sheet
  const balanceSheet = calculateBalanceSheet(
    portfolio.holdings,
    liabilities,
    cash,
    otherAssets,
    otherLiabilities,
    portfolio.assets
  );

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setPortfolio(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setPortfolio(prev => ({
      ...prev,
      transactions: prev.transactions.map(transaction =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      )
    }));
  };

  const deleteTransaction = (id: string) => {
    console.log('Deleting transaction:', id);
    setPortfolio(prev => ({
      ...prev,
      transactions: prev.transactions.filter(transaction => transaction.id !== id)
    }));
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const transaction = portfolio.transactions.find(t => t.id === transactionId);
    if (transaction) {
      setConfirmDialog({
        isOpen: true,
        title: 'Delete Transaction',
        message: `Are you sure you want to delete the ${transaction.type} transaction for ${transaction.symbol}? This action cannot be undone.`,
        onConfirm: () => deleteTransaction(transactionId),
        type: 'danger'
      });
    }
  };

  const handleDeleteHolding = (holding: Holding) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Asset',
      message: `Are you sure you want to delete all transactions for ${holding.symbol} (${holding.name})? This will remove the entire holding from your portfolio. This action cannot be undone.`,
      onConfirm: () => {
        // Delete all transactions for this symbol
        setPortfolio(prev => ({
          ...prev,
          transactions: prev.transactions.filter(transaction => transaction.symbol !== holding.symbol)
        }));
      },
      type: 'danger'
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    console.log('Editing transaction:', transaction);
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleSaveTransaction = (transaction: Omit<Transaction, 'id'>) => {
    console.log('Saving transaction:', transaction, 'Editing:', editingTransaction);
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
    } else {
      addTransaction(transaction);
    }
    setEditingTransaction(null);
    setIsTransactionModalOpen(false);
  };

  // Liability management functions
  const addLiability = (liability: Omit<Liability, 'id'>) => {
    const newLiability: Liability = {
      ...liability,
      id: Date.now().toString()
    };
    setLiabilities(prev => [...prev, newLiability]);
  };

  const updateLiability = (id: string, updatedLiability: Partial<Liability>) => {
    setLiabilities(prev =>
      prev.map(liability =>
        liability.id === id ? { ...liability, ...updatedLiability } : liability
      )
    );
  };

  const deleteLiability = (id: string) => {
    setLiabilities(prev => prev.filter(liability => liability.id !== id));
  };

  const handleEditLiability = (liability: Liability) => {
    setEditingLiability(liability);
    setIsLiabilityModalOpen(true);
  };

  const handleAddLiability = () => {
    setEditingLiability(null);
    setIsLiabilityModalOpen(true);
  };

  const handleSaveLiability = (liability: Omit<Liability, 'id'>) => {
    if (editingLiability) {
      updateLiability(editingLiability.id, liability);
    } else {
      addLiability(liability);
    }
    setEditingLiability(null);
  };

  // Asset management functions
  const addAsset = (asset: Omit<Asset, 'id'>) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString()
    };
    setPortfolio(prev => ({
      ...prev,
      assets: [...prev.assets, newAsset]
    }));
  };

  const updateAsset = (id: string, updatedAsset: Partial<Asset>) => {
    setPortfolio(prev => ({
      ...prev,
      assets: prev.assets.map(asset =>
        asset.id === id ? { ...asset, ...updatedAsset } : asset
      )
    }));
  };

  const deleteAsset = (id: string) => {
    setPortfolio(prev => ({
      ...prev,
      assets: prev.assets.filter(asset => asset.id !== id)
    }));
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsAssetModalOpen(true);
  };

  const handleAddAsset = () => {
    setEditingAsset(null);
    setIsAssetModalOpen(true);
  };

  const handleSaveAsset = (asset: Omit<Asset, 'id'>) => {
    if (editingAsset) {
      updateAsset(editingAsset.id, asset);
    } else {
      addAsset(asset);
    }
    setEditingAsset(null);
    setIsAssetModalOpen(false);
  };

  const handleDeleteAsset = (asset: Asset) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Asset',
      message: `Are you sure you want to delete ${asset.name}? This action cannot be undone.`,
      onConfirm: () => deleteAsset(asset.id),
      type: 'danger'
    });
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      console.log('User triggered refresh...');
      
      // Refresh all API data first
      await refreshAllData();
      
      // Then refresh portfolio with fresh data
      const { holdings, metrics } = await refreshPortfolio(portfolio.transactions);
      
      // Update portfolio with fresh holdings and metrics
      setPortfolio(prev => ({
        ...prev,
        holdings,
        metrics,
        lastRefreshTime: new Date().toISOString()
      }));
      
      console.log('Refresh completed successfully');
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Currency: ₹ INR</span>
                    {portfolio.lastRefreshTime && (
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${hasStaleData ? 'text-orange-600' : 'text-gray-500'}`}>
                          Last updated: {new Date(portfolio.lastRefreshTime).toLocaleString()}
                        </span>
                        {hasStaleData && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Stale Data
                          </span>
                        )}
                      </div>
                    )}
                  </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  title="Refresh all data"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                    {(activeTab === 'assets' || activeTab === 'transactions') && (
                  <button
                    onClick={handleAddTransaction}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Asset</span>
                  </button>
                )}
                {activeTab === 'liabilities' && (
                  <button
                    onClick={handleAddLiability}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Add Liability</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Refresh Error Display */}
        {refreshError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              Refresh error: {refreshError}
            </p>
          </div>
        )}
        
        {/* Balance Sheet Summary */}
        {activeTab === 'balance-sheet' && (
          <BalanceSheetSummary
            balanceSheet={balanceSheet}
            displayCurrency={selectedCurrency}
          />
        )}

        {/* Portfolio Summary for other tabs */}
        {activeTab !== 'balance-sheet' && (
          <PortfolioSummary 
            metrics={portfolio.metrics}
            displayCurrency={selectedCurrency}
          />
        )}

        {/* Tab Navigation */}
        <div className="mt-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'balance-sheet', label: 'Balance Sheet', icon: DollarSign, count: null },
              { id: 'assets', label: 'Assets', icon: TrendingUp, count: portfolio.assets.length + portfolio.holdings.length },
              { id: 'liabilities', label: 'Liabilities', icon: CreditCard, count: liabilities.length },
              { id: 'transactions', label: 'Transactions', icon: Plus, count: portfolio.transactions.length }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'assets' ? (
            <ComprehensiveAssetsView
              holdings={portfolio.holdings}
              assets={portfolio.assets}
              displayCurrency={selectedCurrency}
              onEditHolding={(holding) => {
                const holdingTransactions = portfolio.transactions.filter(t => t.symbol === holding.symbol);
                if (holdingTransactions.length > 0) {
                  handleEditTransaction(holdingTransactions[0]);
                }
              }}
              onDeleteHolding={handleDeleteHolding}
              onEditAsset={handleEditAsset}
              onDeleteAsset={handleDeleteAsset}
              onAddAsset={handleAddAsset}
              onAddTransaction={handleAddTransaction}
            />
          ) : activeTab === 'transactions' ? (
            <ComprehensiveTransactionsView
              transactions={portfolio.transactions}
              liabilities={liabilities}
              displayCurrency={selectedCurrency}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onEditLiability={handleEditLiability}
              onDeleteLiability={deleteLiability}
              onAddTransaction={handleAddTransaction}
              onAddLiability={handleAddLiability}
            />
          ) : activeTab === 'balance-sheet' ? (
            <BalanceSheetSummary
              balanceSheet={balanceSheet}
              displayCurrency={selectedCurrency}
            />
            ) : activeTab === 'liabilities' ? (
              <LiabilitiesTable
                liabilities={liabilities}
                displayCurrency={selectedCurrency}
                onEditLiability={handleEditLiability}
                onDeleteLiability={deleteLiability}
                onAddLiability={handleAddLiability}
              />
            ) : null}
        </div>
      </main>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        onSaveTransaction={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />

      {/* Liability Modal */}
      <LiabilityModal
        isOpen={isLiabilityModalOpen}
        onClose={() => {
          setIsLiabilityModalOpen(false);
          setEditingLiability(null);
        }}
        onSaveLiability={handleSaveLiability}
        editingLiability={editingLiability}
      />

      {/* Asset Modal */}
      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => {
          setIsAssetModalOpen(false);
          setEditingAsset(null);
        }}
        onSaveAsset={handleSaveAsset}
        editingAsset={editingAsset}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />

    </div>
  );
};

export default App;
