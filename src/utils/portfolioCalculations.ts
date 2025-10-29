import { Transaction, Holding, PortfolioMetrics } from '../types/portfolio';

export const calculateHoldingsFromTransactions = (transactions: Transaction[]): Holding[] => {
  const holdingsMap = new Map<string, Holding>();

  // Group transactions by symbol
  transactions.forEach(transaction => {
    const symbol = transaction.symbol;
    
    if (!holdingsMap.has(symbol)) {
      holdingsMap.set(symbol, {
        symbol: transaction.symbol,
        name: transaction.name,
        totalQuantity: 0,
        averageCost: 0,
        lastTradedPrice: transaction.price,
        currentValue: 0,
        profitLoss: 0,
        profitLossPercent: 0,
        dayChange: 0,
        dayChangePercent: 0,
        currency: transaction.currency,
        exchange: transaction.exchange,
        transactions: []
      });
    }

    const holding = holdingsMap.get(symbol)!;
    holding.transactions.push(transaction);

    if (transaction.type === 'BUY') {
      // Calculate new average cost
      const totalCost = (holding.averageCost * holding.totalQuantity) + (transaction.price * transaction.quantity);
      holding.totalQuantity += transaction.quantity;
      holding.averageCost = holding.totalQuantity > 0 ? totalCost / holding.totalQuantity : 0;
    } else if (transaction.type === 'SELL') {
      holding.totalQuantity -= transaction.quantity;
      // If quantity becomes 0 or negative, reset average cost
      if (holding.totalQuantity <= 0) {
        holding.averageCost = 0;
        holding.totalQuantity = 0;
      }
    }

    // Update last traded price
    holding.lastTradedPrice = transaction.price;
  });

  // Filter out holdings with zero quantity
  const holdings = Array.from(holdingsMap.values()).filter(holding => holding.totalQuantity > 0);

  // Calculate current values and P&L
  holdings.forEach(holding => {
    holding.currentValue = holding.totalQuantity * holding.lastTradedPrice;
    const totalCost = holding.totalQuantity * holding.averageCost;
    holding.profitLoss = holding.currentValue - totalCost;
    holding.profitLossPercent = totalCost > 0 ? (holding.profitLoss / totalCost) * 100 : 0;
    
    // TODO: Calculate day change when we have historical data
    holding.dayChange = 0;
    holding.dayChangePercent = 0;
  });

  return holdings;
};

export const calculatePortfolioMetrics = (holdings: Holding[]): PortfolioMetrics => {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalCost = holdings.reduce((sum, holding) => sum + (holding.totalQuantity * holding.averageCost), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  // TODO: Calculate day change when we have historical data
  const dayChange = 0;
  const dayChangePercentage = 0;

  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercentage,
    dayChange,
    dayChangePercentage
  };
};

export const migrateOldPortfolio = (oldStocks: any[]): { holdings: Holding[], transactions: Transaction[] } => {
  const transactions: Transaction[] = oldStocks.map(stock => ({
    id: stock.id,
    symbol: stock.symbol,
    name: stock.name,
    type: 'BUY' as const,
    quantity: stock.shares,
    price: stock.purchasePrice,
    date: stock.purchaseDate,
    currency: 'INR',
    exchange: 'NSE',
    notes: 'Migrated from old portfolio'
  }));

  const holdings = calculateHoldingsFromTransactions(transactions);
  
  return { holdings, transactions };
};
