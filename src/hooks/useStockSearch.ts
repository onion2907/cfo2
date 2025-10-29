import { useState, useCallback, useRef, useEffect } from 'react';
import { alphaVantageAPI, StockSearchResult, StockQuote } from '../services/alphaVantageApi';

export interface UseStockSearchReturn {
  searchQuery: string;
  searchResults: StockSearchResult[];
  selectedStock: StockSearchResult | null;
  stockQuote: StockQuote | null;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  selectStock: (stock: StockSearchResult | null | undefined) => void;
  clearSearch: () => void;
  fetchQuote: (symbol: string) => Promise<void>;
}

export const useStockSearch = (apiKey?: string): UseStockSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchTimeoutRef = useRef<number | null>(null);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await alphaVantageAPI.searchStocks(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // Handle search query changes with debouncing
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = window.setTimeout(() => {
      performSearch(query);
    }, 500); // 500ms delay
  }, [performSearch]);

  // Select a stock from search results
  const selectStock = useCallback((stock: StockSearchResult | null | undefined) => {
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

  // Clear search and reset state
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedStock(null);
    setStockQuote(null);
    setError(null);
  }, []);

  // Fetch current quote for a symbol
  const fetchQuote = useCallback(async (symbol: string) => {
    if (!symbol) return;

    setIsLoading(true);
    setError(null);

    try {
      const quote = await alphaVantageAPI.getStockQuote(symbol);
      setStockQuote(quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    searchResults,
    selectedStock,
    stockQuote,
    isLoading,
    error,
    setSearchQuery: handleSearchQueryChange,
    selectStock,
    clearSearch,
    fetchQuote
  };
};
