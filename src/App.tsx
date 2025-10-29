import React, { useState, useEffect } from 'react';
import { Portfolio, Transaction } from './types/portfolio';
import PortfolioSummary from './components/PortfolioSummary';
import HoldingsTable from './components/HoldingsTable';
import TransactionsTable from './components/TransactionsTable';
import TabNavigation from './components/TabNavigation';
import TransactionModal from './components/TransactionModal';
import CurrencySelector from './components/CurrencySelector';
import { useCurrencyConversion } from './hooks/useCurrencyConversion';
import { calculateHoldingsFromTransactions, calculatePortfolioMetrics, migrateOldPortfolio } from './utils/portfolioCalculations';
import { Plus, TrendingUp, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'stock-portfolio';

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
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions'>('holdings');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Currency conversion hook - using holdings for conversion
  const {
    selectedCurrency,
    convertedPortfolio,
    isLoading: isConverting,
    error: conversionError,
    usingFallbackRates,
    setSelectedCurrency,
    refreshConversion,
    supportedCurrencies
  } = useCurrencyConversion(portfolio.holdings.map(h => ({
    id: h.symbol,
    symbol: h.symbol,
    name: h.name,
    shares: h.totalQuantity,
    purchasePrice: h.averageCost,
    currentPrice: h.lastTradedPrice,
    purchaseDate: new Date().toISOString().split('T')[0],
    currency: h.currency
  })));

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
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  // Recalculate holdings and metrics when transactions change
  useEffect(() => {
    const holdings = calculateHoldingsFromTransactions(portfolio.transactions);
    const metrics = calculatePortfolioMetrics(holdings);
    setPortfolio(prev => ({ ...prev, holdings, metrics }));
  }, [portfolio.transactions]);

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
    setPortfolio(prev => ({
      ...prev,
      transactions: prev.transactions.filter(transaction => transaction.id !== id)
    }));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleSaveTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
    } else {
      addTransaction(transaction);
    }
    setEditingTransaction(null);
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
                <span className="text-sm text-gray-600">Display in:</span>
                <CurrencySelector
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={setSelectedCurrency}
                  supportedCurrencies={supportedCurrencies}
                  isLoading={isConverting}
                />
                <button
                  onClick={refreshConversion}
                  disabled={isConverting}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  title="Refresh exchange rates"
                >
                  <RefreshCw className={`h-4 w-4 ${isConverting ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <button
                onClick={handleAddTransaction}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {conversionError && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-sm text-danger-600">
              Currency conversion error: {conversionError}
            </p>
          </div>
        )}
        
        {usingFallbackRates && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Using fallback exchange rates due to API rate limits. Values may not be current.
            </p>
          </div>
        )}
        
        {/* Portfolio Summary */}
        {convertedPortfolio ? (
          <PortfolioSummary 
            metrics={{
              totalValue: convertedPortfolio.totalValue,
              totalCost: convertedPortfolio.totalCost,
              totalGainLoss: convertedPortfolio.totalGainLoss,
              totalGainLossPercentage: convertedPortfolio.totalGainLossPercentage,
              dayChange: 0, // TODO: Implement day change calculation
              dayChangePercentage: 0
            }}
            displayCurrency={convertedPortfolio.displayCurrency}
          />
        ) : (
          <PortfolioSummary metrics={portfolio.metrics} />
        )}

        {/* Tab Navigation */}
        <div className="mt-8">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            holdingsCount={portfolio.holdings.length}
            transactionsCount={portfolio.transactions.length}
          />
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'holdings' ? (
            <HoldingsTable
              holdings={convertedPortfolio ? 
                convertedPortfolio.stocks.map(s => ({
                  symbol: s.symbol,
                  name: s.name,
                  totalQuantity: s.shares,
                  averageCost: s.purchasePrice,
                  lastTradedPrice: s.currentPrice,
                  currentValue: s.shares * s.currentPrice,
                  profitLoss: (s.shares * s.currentPrice) - (s.shares * s.purchasePrice),
                  profitLossPercent: s.purchasePrice > 0 ? ((s.currentPrice - s.purchasePrice) / s.purchasePrice) * 100 : 0,
                  dayChange: 0,
                  dayChangePercent: 0,
                  currency: s.currency,
                  transactions: []
                })) : portfolio.holdings
              }
              displayCurrency={convertedPortfolio?.displayCurrency || 'USD'}
              onEditHolding={(holding) => {
                // Find transactions for this holding
                const holdingTransactions = portfolio.transactions.filter(t => t.symbol === holding.symbol);
                if (holdingTransactions.length > 0) {
                  handleEditTransaction(holdingTransactions[0]);
                }
              }}
              onViewTransactions={() => {
                setActiveTab('transactions');
              }}
            />
          ) : (
            <TransactionsTable
              transactions={portfolio.transactions}
              displayCurrency={convertedPortfolio?.displayCurrency || 'USD'}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={deleteTransaction}
              onAddTransaction={handleAddTransaction}
            />
          )}
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

    </div>
  );
};

export default App;
