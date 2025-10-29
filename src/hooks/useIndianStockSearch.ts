import { useState, useCallback, useRef, useEffect } from 'react';
import { indianStockAPI, IndianStockSearchResult, IndianStockQuote } from '../services/indianStockApi';

export interface UseIndianStockSearchReturn {
  searchQuery: string;
  searchResults: IndianStockSearchResult[];
  selectedStock: IndianStockSearchResult | null;
  stockQuote: IndianStockQuote | null;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  selectStock: (stock: IndianStockSearchResult | null | undefined) => void;
  clearSearch: () => void;
  fetchQuote: (symbol: string) => Promise<void>;
  trendingStocks: IndianStockSearchResult[];
  mostActiveBSE: IndianStockSearchResult[];
  mostActiveNSE: IndianStockSearchResult[];
  priceShockers: IndianStockSearchResult[];
}

export const useIndianStockSearch = (): UseIndianStockSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IndianStockSearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<IndianStockSearchResult | null>(null);
  const [stockQuote, setStockQuote] = useState<IndianStockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendingStocks, setTrendingStocks] = useState<IndianStockSearchResult[]>([]);
  const [mostActiveBSE, setMostActiveBSE] = useState<IndianStockSearchResult[]>([]);
  const [mostActiveNSE, setMostActiveNSE] = useState<IndianStockSearchResult[]>([]);
  const [priceShockers, setPriceShockers] = useState<IndianStockSearchResult[]>([]);

  const searchTimeoutRef = useRef<number | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [trending, bseActive, nseActive, shockers] = await Promise.all([
        indianStockAPI.getTrendingStocks(),
        indianStockAPI.getBSEMostActive(),
        indianStockAPI.getNSEMostActive(),
        indianStockAPI.getPriceShockers()
      ]);

      setTrendingStocks(trending.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        currentPrice: stock.currentPrice,
        marketCap: 0
      })));

      setMostActiveBSE(bseActive.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        currentPrice: stock.currentPrice,
        marketCap: 0
      })));

      setMostActiveNSE(nseActive.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        currentPrice: stock.currentPrice,
        marketCap: 0
      })));

      setPriceShockers(shockers.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        currentPrice: stock.currentPrice,
        marketCap: 0
      })));
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await indianStockAPI.searchStocks(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search query changes with debouncing
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = window.setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms debounce
  }, [performSearch]);

  // Select a stock from search results
  const selectStock = useCallback((stock: IndianStockSearchResult | null | undefined) => {
    if (stock) {
      setSelectedStock(stock);
      setSearchQuery(`${stock.symbol} - ${stock.name}`);
    } else {
      setSelectedStock(null);
      setSearchQuery('');
    }
    setSearchResults([]);
    setError(null);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedStock(null);
    setError(null);
  }, []);

  // Fetch current quote for a symbol
  const fetchQuote = useCallback(async (symbol: string) => {
    if (!symbol) return;

    setIsLoading(true);
    setError(null);

    try {
      const quote = await indianStockAPI.getStockQuote(symbol);
      setStockQuote(quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    searchResults,
    selectedStock,
    stockQuote,
    isLoading,
    error,
    selectStock,
    clearSearch,
    fetchQuote,
    trendingStocks,
    mostActiveBSE,
    mostActiveNSE,
    priceShockers
  };
};
