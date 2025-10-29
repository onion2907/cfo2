import React, { useState, useEffect } from 'react';
import { Stock, Portfolio, PortfolioMetrics } from './types/portfolio';
import PortfolioSummary from './components/PortfolioSummary';
import StockList from './components/StockList';
import AddStockModal from './components/AddStockModal';
import { Plus, TrendingUp } from 'lucide-react';

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
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PortfolioSummary metrics={portfolio.metrics} />
        <StockList
          stocks={portfolio.stocks}
          onUpdateStock={updateStock}
          onRemoveStock={removeStock}
        />
      </main>

      {/* Add Stock Modal */}
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStock={addStock}
      />
    </div>
  );
};

export default App;
