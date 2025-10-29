import React, { useState } from 'react';
import { alphaVantageAPI } from '../services/alphaVantageApi';

const DebugPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testStockSearch = async () => {
    setIsLoading(true);
    addResult('Testing stock search...');
    try {
      const results = await alphaVantageAPI.searchStocks('AAPL');
      addResult(`Search successful: Found ${results.length} results`);
      addResult(`First result: ${results[0]?.symbol} - ${results[0]?.name}`);
    } catch (error) {
      addResult(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testStockQuote = async () => {
    setIsLoading(true);
    addResult('Testing stock quote...');
    try {
      const quote = await alphaVantageAPI.getStockQuote('AAPL');
      addResult(`Quote successful: ${quote.symbol} - $${quote.price} ${quote.currency}`);
    } catch (error) {
      addResult(`Quote failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testExchangeRate = async () => {
    setIsLoading(true);
    addResult('Testing exchange rate...');
    try {
      const rate = await alphaVantageAPI.getExchangeRate('USD', 'INR');
      addResult(`Exchange rate successful: 1 USD = ${rate.rate} INR`);
    } catch (error) {
      addResult(`Exchange rate failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCurrencyConversion = async () => {
    setIsLoading(true);
    addResult('Testing currency conversion...');
    try {
      const converted = await alphaVantageAPI.convertCurrency(100, 'USD', 'INR');
      addResult(`Conversion successful: $100 USD = ₹${converted.toFixed(2)} INR`);
    } catch (error) {
      addResult(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto">
      <h3 className="font-bold text-lg mb-2">Debug Panel</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testStockSearch}
          disabled={isLoading}
          className="w-full px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test Stock Search
        </button>
        <button
          onClick={testStockQuote}
          disabled={isLoading}
          className="w-full px-3 py-1 bg-green-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test Stock Quote
        </button>
        <button
          onClick={testExchangeRate}
          disabled={isLoading}
          className="w-full px-3 py-1 bg-yellow-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test Exchange Rate
        </button>
        <button
          onClick={testCurrencyConversion}
          disabled={isLoading}
          className="w-full px-3 py-1 bg-purple-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test Currency Conversion
        </button>
        <button
          onClick={clearResults}
          className="w-full px-3 py-1 bg-gray-500 text-white rounded text-sm"
        >
          Clear Results
        </button>
      </div>

      <div className="text-xs space-y-1">
        {testResults.map((result, index) => (
          <div key={index} className="text-gray-600">{result}</div>
        ))}
      </div>
    </div>
  );
};

export default DebugPanel;
