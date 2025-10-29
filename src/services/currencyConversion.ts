import { alphaVantageAPI } from './alphaVantageApi';
import { Stock } from '../types/portfolio';

export interface ConvertedStock extends Stock {
  convertedPrice: number;
  convertedValue: number;
  convertedCostBasis: number;
  convertedGainLoss: number;
  displayCurrency: string;
}

export interface ConvertedPortfolio {
  stocks: ConvertedStock[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  displayCurrency: string;
}

class CurrencyConversionService {
  async convertPortfolioToCurrency(
    stocks: Stock[], 
    targetCurrency: string
  ): Promise<ConvertedPortfolio> {
    const convertedStocks: ConvertedStock[] = [];
    let totalValue = 0;
    let totalCost = 0;

    // Convert each stock to the target currency
    for (const stock of stocks) {
      try {
        const convertedPrice = await alphaVantageAPI.convertCurrency(
          stock.currentPrice,
          stock.currency,
          targetCurrency
        );

        const convertedPurchasePrice = await alphaVantageAPI.convertCurrency(
          stock.purchasePrice,
          stock.currency,
          targetCurrency
        );

        const convertedValue = stock.shares * convertedPrice;
        const convertedCostBasis = stock.shares * convertedPurchasePrice;
        const convertedGainLoss = convertedValue - convertedCostBasis;

        convertedStocks.push({
          ...stock,
          convertedPrice,
          convertedValue,
          convertedCostBasis,
          convertedGainLoss,
          displayCurrency: targetCurrency
        });

        totalValue += convertedValue;
        totalCost += convertedCostBasis;
      } catch (error) {
        console.error(`Failed to convert ${stock.symbol} from ${stock.currency} to ${targetCurrency}:`, error);
        // Fallback: use original values if conversion fails
        const convertedStock: ConvertedStock = {
          ...stock,
          convertedPrice: stock.currentPrice,
          convertedValue: stock.shares * stock.currentPrice,
          convertedCostBasis: stock.shares * stock.purchasePrice,
          convertedGainLoss: (stock.shares * stock.currentPrice) - (stock.shares * stock.purchasePrice),
          displayCurrency: targetCurrency
        };
        convertedStocks.push(convertedStock);
        totalValue += convertedStock.convertedValue;
        totalCost += convertedStock.convertedCostBasis;
      }
    }

    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    return {
      stocks: convertedStocks,
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercentage,
      displayCurrency: targetCurrency
    };
  }

  async convertSingleStock(
    stock: Stock,
    targetCurrency: string
  ): Promise<ConvertedStock> {
    try {
      const convertedPrice = await alphaVantageAPI.convertCurrency(
        stock.currentPrice,
        stock.currency,
        targetCurrency
      );

      const convertedPurchasePrice = await alphaVantageAPI.convertCurrency(
        stock.purchasePrice,
        stock.currency,
        targetCurrency
      );

      const convertedValue = stock.shares * convertedPrice;
      const convertedCostBasis = stock.shares * convertedPurchasePrice;
      const convertedGainLoss = convertedValue - convertedCostBasis;

      return {
        ...stock,
        convertedPrice,
        convertedValue,
        convertedCostBasis,
        convertedGainLoss,
        displayCurrency: targetCurrency
      };
    } catch (error) {
      console.error(`Failed to convert ${stock.symbol}:`, error);
      // Return original values if conversion fails
      return {
        ...stock,
        convertedPrice: stock.currentPrice,
        convertedValue: stock.shares * stock.currentPrice,
        convertedCostBasis: stock.shares * stock.purchasePrice,
        convertedGainLoss: (stock.shares * stock.currentPrice) - (stock.shares * stock.purchasePrice),
        displayCurrency: targetCurrency
      };
    }
  }

  getSupportedCurrencies(): string[] {
    return alphaVantageAPI.getSupportedCurrencies();
  }
}

export const currencyConversionService = new CurrencyConversionService();
