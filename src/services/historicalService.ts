import axios from 'axios';
import { subDays } from 'date-fns';
import { PriceHistory, HistoricalPrice } from '../types/crypto';

export class HistoricalService {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';

  async getHistoricalPrices(
    symbol: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<PriceHistory> {
    try {
      const end = endDate || new Date();
      const start = startDate || subDays(end, 30);

      const response = await axios.get(
        `${this.baseUrl}/coins/${symbol}/market_chart/range`,
        {
          params: {
            vs_currency: 'usd',
            from: Math.floor(start.getTime() / 1000),
            to: Math.floor(end.getTime() / 1000)
          }
        }
      );

      const prices: HistoricalPrice[] = response.data.prices.map(
        ([timestamp, price]: [number, number]) => ({
          timestamp,
          price
        })
      );

      return {
        symbol,
        prices
      };
    } catch (error) {
      throw new Error('Failed to fetch historical price data');
    }
  }

  calculateMovingAverage(
    prices: HistoricalPrice[],
    period: number
  ): HistoricalPrice[] {
    if (prices.length < period || period <= 0) {
      return [];
    }

    const movingAverages: HistoricalPrice[] = [];

    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      const average = slice.reduce((sum, price) => sum + price.price, 0) / period;
      
      movingAverages.push({
        timestamp: prices[i].timestamp,
        price: Math.round(average * 100) / 100 // Round to 2 decimal places
      });
    }

    return movingAverages;
  }

  calculatePriceVolatility(prices: HistoricalPrice[]): number {
    if (prices.length <= 1) {
      return 0;
    }

    const priceValues = prices.map(p => p.price);
    const mean = priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length;
    
    const variance = priceValues.reduce((sum, price) => {
      const diff = price - mean;
      return sum + (diff * diff);
    }, 0) / priceValues.length;

    return Math.sqrt(variance);
  }
}