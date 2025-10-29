import { alphaVantageAPI } from './alphaVantageApi';
import { getFallbackExchangeRate } from './fallbackExchangeRates';
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
        console.log(`Converting ${stock.symbol} from ${stock.currency} to ${targetCurrency}`);
        
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

        console.log(`Conversion successful: ${stock.symbol} - Price: ${stock.currentPrice} ${stock.currency} -> ${convertedPrice} ${targetCurrency}`);

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
        
        // Use fallback exchange rates
        console.log(`Using fallback exchange rate for ${stock.symbol}`);
        const fallbackRate = getFallbackExchangeRate(stock.currency, targetCurrency);
        const convertedPrice = stock.currentPrice * fallbackRate;
        const convertedPurchasePrice = stock.purchasePrice * fallbackRate;
        
        console.log(`Fallback conversion: ${stock.currentPrice} ${stock.currency} * ${fallbackRate} = ${convertedPrice} ${targetCurrency}`);

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
      
      // Use fallback exchange rates
      console.log(`Using fallback exchange rate for single stock conversion: ${stock.symbol}`);
      const fallbackRate = getFallbackExchangeRate(stock.currency, targetCurrency);
      const convertedPrice = stock.currentPrice * fallbackRate;
      const convertedPurchasePrice = stock.purchasePrice * fallbackRate;
      
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
    }
  }

  getSupportedCurrencies(): string[] {
    return alphaVantageAPI.getSupportedCurrencies();
  }
}

export const currencyConversionService = new CurrencyConversionService();
