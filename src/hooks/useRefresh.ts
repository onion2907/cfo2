import { useState, useCallback } from 'react';
import { indianStockAPI } from '../services/indianStockApi';
import { Transaction, Holding } from '../types/portfolio';
import { calculateHoldingsFromTransactions, calculatePortfolioMetrics } from '../utils/portfolioCalculations';

export interface UseRefreshReturn {
  isRefreshing: boolean;
  lastRefreshTime: Date | null;
  refreshError: string | null;
  refreshPortfolio: (transactions: Transaction[]) => Promise<{ holdings: Holding[]; metrics: any }>;
  refreshAllData: () => Promise<void>;
}

export const useRefresh = (): UseRefreshReturn => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const refreshPortfolio = useCallback(async (transactions: Transaction[]) => {
    setIsRefreshing(true);
    setRefreshError(null);

    try {
      console.log('Refreshing portfolio data...');
      
      // Get unique stock symbols from transactions
      const symbols = [...new Set(transactions.map(t => t.symbol))];
      
      // Refresh quotes for all stocks in portfolio
      const refreshPromises = symbols.map(async (symbol) => {
        try {
          const freshQuote = await indianStockAPI.getFreshStockQuote(symbol);
          if (freshQuote) {
            console.log(`Refreshed quote for ${symbol}:`, freshQuote.currentPrice);
            return { symbol, quote: freshQuote };
          }
        } catch (error) {
          console.error(`Error refreshing quote for ${symbol}:`, error);
        }
        return null;
      });

      const refreshResults = await Promise.all(refreshPromises);
      const successfulRefreshes = refreshResults.filter(result => result !== null);
      
      console.log(`Successfully refreshed ${successfulRefreshes.length} out of ${symbols.length} stocks`);

      // Recalculate holdings with updated prices
      const holdings = calculateHoldingsFromTransactions(transactions);
      
      // Update holdings with fresh quotes
      holdings.forEach(holding => {
        const freshQuote = successfulRefreshes.find(r => r?.symbol === holding.symbol)?.quote;
        if (freshQuote) {
          holding.lastTradedPrice = freshQuote.currentPrice;
          holding.currentValue = holding.totalQuantity * freshQuote.currentPrice;
          holding.profitLoss = holding.currentValue - (holding.totalQuantity * holding.averageCost);
          holding.profitLossPercent = holding.averageCost > 0 ? (holding.profitLoss / (holding.totalQuantity * holding.averageCost)) * 100 : 0;
          holding.dayChange = freshQuote.change;
          holding.dayChangePercent = freshQuote.changePercent;
          console.log(`Updated ${holding.symbol} LTP: ${holding.lastTradedPrice}, Current Value: ${holding.currentValue}`);
        }
      });
      
      const metrics = calculatePortfolioMetrics(holdings);

      setLastRefreshTime(new Date());
      
      return { holdings, metrics };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh portfolio data';
      setRefreshError(errorMessage);
      console.error('Error refreshing portfolio:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshError(null);

    try {
      console.log('Refreshing all API data...');
      await indianStockAPI.refreshAllData();
      setLastRefreshTime(new Date());
      console.log('All data refreshed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh data';
      setRefreshError(errorMessage);
      console.error('Error refreshing all data:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    isRefreshing,
    lastRefreshTime,
    refreshError,
    refreshPortfolio,
    refreshAllData
  };
};
