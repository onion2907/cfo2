import React, { useState, useEffect } from 'react';
import { Portfolio, Transaction, Liability } from './types/portfolio';
import PortfolioSummary from './components/PortfolioSummary';
import HoldingsTable from './components/HoldingsTable';
import TransactionsTable from './components/TransactionsTable';
import LiabilitiesTable from './components/LiabilitiesTable';
import BalanceSheetSummary from './components/BalanceSheetSummary';
import TransactionModal from './components/TransactionModal';
import LiabilityModal from './components/LiabilityModal';
import { calculateHoldingsFromTransactions, calculatePortfolioMetrics, migrateOldPortfolio } from './utils/portfolioCalculations';
import { calculateBalanceSheet } from './utils/liabilityCalculations';
import { formatCurrency } from './utils/currency';
import { useRefresh } from './hooks/useRefresh';
import { indianStockAPI } from './services/indianStockApi';
import { Plus, TrendingUp, CreditCard, DollarSign, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'stock-portfolio';
const LIABILITIES_STORAGE_KEY = 'liabilities';

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    holdings: [],
    transactions: [],
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
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions' | 'liabilities' | 'balance-sheet'>('balance-sheet');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isLiabilityModalOpen, setIsLiabilityModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingLiability, setEditingLiability] = useState<Liability | null>(null);

  // Focus on INR currency only
  const selectedCurrency = 'INR';

  // Refresh functionality
  const {
    isRefreshing,
    lastRefreshTime,
    refreshError,
    refreshPortfolio,
    refreshAllData
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
          setPortfolio({ holdings, transactions, metrics });
        } else {
          setPortfolio(parsedPortfolio);
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
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
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

  // Recalculate holdings and metrics when transactions change
  useEffect(() => {
    const holdings = calculateHoldingsFromTransactions(portfolio.transactions);
    const metrics = calculatePortfolioMetrics(holdings);
    setPortfolio(prev => ({ ...prev, holdings, metrics }));
  }, [portfolio.transactions]);

  // Fetch current prices for holdings on initial load
  useEffect(() => {
    const fetchInitialPrices = async () => {
      if (portfolio.holdings.length > 0) {
        console.log('Fetching initial current prices for holdings...');
        try {
          const symbols = [...new Set(portfolio.holdings.map(h => h.symbol))];
          const pricePromises = symbols.map(async (symbol) => {
            try {
              const quote = await indianStockAPI.getStockQuote(symbol);
              return quote ? { symbol, price: quote.currentPrice } : null;
            } catch (error) {
              console.error(`Error fetching price for ${symbol}:`, error);
              return null;
            }
          });

          const priceResults = await Promise.all(pricePromises);
          const currentPrices = new Map(
            priceResults
              .filter(result => result !== null)
              .map(result => [result!.symbol, result!.price])
          );

          if (currentPrices.size > 0) {
            const updatedHoldings = portfolio.holdings.map(holding => {
              const currentPrice = currentPrices.get(holding.symbol);
              if (currentPrice && currentPrice > 0) {
                return {
                  ...holding,
                  lastTradedPrice: currentPrice,
                  currentValue: holding.totalQuantity * currentPrice,
                  profitLoss: (holding.totalQuantity * currentPrice) - (holding.totalQuantity * holding.averageCost),
                  profitLossPercent: holding.averageCost > 0 ? 
                    (((holding.totalQuantity * currentPrice) - (holding.totalQuantity * holding.averageCost)) / (holding.totalQuantity * holding.averageCost)) * 100 : 0
                };
              }
              return holding;
            });

            const updatedMetrics = calculatePortfolioMetrics(updatedHoldings);
            setPortfolio(prev => ({ ...prev, holdings: updatedHoldings, metrics: updatedMetrics }));
            console.log('Initial prices fetched and holdings updated');
          }
        } catch (error) {
          console.error('Error fetching initial prices:', error);
        }
      }
    };

    fetchInitialPrices();
  }, []); // Only run once on mount

  // Calculate balance sheet
  const balanceSheet = calculateBalanceSheet(
    portfolio.holdings,
    liabilities,
    cash,
    otherAssets,
    otherLiabilities
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
        metrics
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
                {lastRefreshTime && (
                  <span className="text-xs text-gray-500">
                    Last updated: {lastRefreshTime.toLocaleTimeString()}
                  </span>
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
                {(activeTab === 'holdings' || activeTab === 'transactions') && (
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
              { id: 'holdings', label: 'Assets', icon: TrendingUp, count: portfolio.holdings.length },
              { id: 'transactions', label: 'Transactions', icon: Plus, count: portfolio.transactions.length },
              { id: 'liabilities', label: 'Liabilities', icon: CreditCard, count: liabilities.length }
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
          {activeTab === 'balance-sheet' ? (
            <div className="space-y-6">
              {/* Assets Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  Assets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Stock Portfolio</h4>
                    <HoldingsTable
                      holdings={portfolio.holdings}
                      displayCurrency={selectedCurrency}
                      onEditHolding={(holding) => {
                        const holdingTransactions = portfolio.transactions.filter(t => t.symbol === holding.symbol);
                        if (holdingTransactions.length > 0) {
                          handleEditTransaction(holdingTransactions[0]);
                        }
                      }}
                      onViewTransactions={() => setActiveTab('transactions')}
                    />
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Other Assets</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Cash</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(cash, selectedCurrency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Other Assets</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(otherAssets, selectedCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liabilities Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 text-red-600 mr-2" />
                  Liabilities
                </h3>
                <LiabilitiesTable
                  liabilities={liabilities}
                  displayCurrency={selectedCurrency}
                  onEditLiability={handleEditLiability}
                  onDeleteLiability={deleteLiability}
                  onAddLiability={handleAddLiability}
                />
              </div>
            </div>
          ) : activeTab === 'holdings' ? (
            <HoldingsTable
              holdings={portfolio.holdings}
              displayCurrency={selectedCurrency}
              onEditHolding={(holding) => {
                const holdingTransactions = portfolio.transactions.filter(t => t.symbol === holding.symbol);
                if (holdingTransactions.length > 0) {
                  handleEditTransaction(holdingTransactions[0]);
                }
              }}
              onViewTransactions={() => setActiveTab('transactions')}
            />
          ) : activeTab === 'transactions' ? (
            <TransactionsTable
              transactions={portfolio.transactions}
              displayCurrency={selectedCurrency}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={deleteTransaction}
              onAddTransaction={handleAddTransaction}
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

    </div>
  );
};

export default App;
