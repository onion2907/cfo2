import React, { useState, useEffect } from 'react';
import { Stock, Portfolio, PortfolioMetrics } from './types/portfolio';
import PortfolioSummary from './components/PortfolioSummary';
import StockList from './components/StockList';
import AddStockModalV2 from './components/AddStockModalV2';
import CurrencySelector from './components/CurrencySelector';
import DebugPanel from './components/DebugPanel';
import { useCurrencyConversion } from './hooks/useCurrencyConversion';
import { Plus, TrendingUp, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'stock-portfolio';

const calculatePortfolioMetrics = (stocks: Stock[]): PortfolioMetrics => {
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.shares * stock.currentPrice), 0);
  const totalCost = stocks.reduce((sum, stock) => sum + (stock.shares * stock.purchasePrice), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  // Mock day change calculation (in real app, this would come from API)
  const dayChange = totalValue * 0.02; // 2% mock day change
  const dayChangePercentage = 2.0;

  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercentage,
    dayChange,
    dayChangePercentage
  };
};

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    stocks: [],
    metrics: {
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercentage: 0,
      dayChange: 0,
      dayChangePercentage: 0
    }
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Currency conversion hook
  const {
    selectedCurrency,
    convertedPortfolio,
    isLoading: isConverting,
    error: conversionError,
    usingFallbackRates,
    setSelectedCurrency,
    refreshConversion,
    supportedCurrencies
  } = useCurrencyConversion(portfolio.stocks);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem(STORAGE_KEY);
    if (savedPortfolio) {
      const parsedPortfolio = JSON.parse(savedPortfolio);
      setPortfolio(parsedPortfolio);
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  const addStock = (stock: Omit<Stock, 'id'>) => {
    const newStock: Stock = {
      ...stock,
      id: Date.now().toString()
    };
    
    const updatedStocks = [...portfolio.stocks, newStock];
    const updatedMetrics = calculatePortfolioMetrics(updatedStocks);
    
    setPortfolio({
      stocks: updatedStocks,
      metrics: updatedMetrics
    });
  };

  const updateStock = (id: string, updatedStock: Partial<Stock>) => {
    const updatedStocks = portfolio.stocks.map(stock =>
      stock.id === id ? { ...stock, ...updatedStock } : stock
    );
    const updatedMetrics = calculatePortfolioMetrics(updatedStocks);
    
    setPortfolio({
      stocks: updatedStocks,
      metrics: updatedMetrics
    });
  };

  const removeStock = (id: string) => {
    const updatedStocks = portfolio.stocks.filter(stock => stock.id !== id);
    const updatedMetrics = calculatePortfolioMetrics(updatedStocks);
    
    setPortfolio({
      stocks: updatedStocks,
      metrics: updatedMetrics
    });
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
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Stock</span>
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
        
        {convertedPortfolio ? (
          <>
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
            <StockList
              stocks={convertedPortfolio.stocks}
              onUpdateStock={updateStock}
              onRemoveStock={removeStock}
            />
          </>
        ) : (
          <>
            <PortfolioSummary metrics={portfolio.metrics} />
            <StockList
              stocks={portfolio.stocks}
              onUpdateStock={updateStock}
              onRemoveStock={removeStock}
            />
          </>
        )}
      </main>

      {/* Add Stock Modal */}
      <AddStockModalV2
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStock={addStock}
      />

      {/* Debug Panel - Remove in production */}
      <DebugPanel />
    </div>
  );
};

export default App;
