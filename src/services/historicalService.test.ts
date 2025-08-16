import axios from 'axios';
import { HistoricalService } from './historicalService';
import { subDays } from 'date-fns';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HistoricalService', () => {
  let historicalService: HistoricalService;

  beforeEach(() => {
    historicalService = new HistoricalService();
    jest.clearAllMocks();
  });

  describe('getHistoricalPrices', () => {
    it('should fetch historical prices for a cryptocurrency', async () => {
      const mockData = {
        prices: [
          [1640995200000, 47000],
          [1641081600000, 47500],
          [1641168000000, 46800],
          [1641254400000, 47200]
        ]
      };

      mockedAxios.get.mockResolvedValue({ data: mockData });

      const endDate = new Date('2024-01-04');
      const startDate = subDays(endDate, 7);
      
      const result = await historicalService.getHistoricalPrices('bitcoin', startDate, endDate);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range',
        {
          params: {
            vs_currency: 'usd',
            from: Math.floor(startDate.getTime() / 1000),
            to: Math.floor(endDate.getTime() / 1000)
          }
        }
      );

      expect(result).toEqual({
        symbol: 'bitcoin',
        prices: [
          { timestamp: 1640995200000, price: 47000 },
          { timestamp: 1641081600000, price: 47500 },
          { timestamp: 1641168000000, price: 46800 },
          { timestamp: 1641254400000, price: 47200 }
        ]
      });
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const endDate = new Date();
      const startDate = subDays(endDate, 7);

      await expect(
        historicalService.getHistoricalPrices('bitcoin', startDate, endDate)
      ).rejects.toThrow('Failed to fetch historical price data');
    });

    it('should fetch historical prices with default date range when none provided', async () => {
      const mockData = { prices: [] };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      await historicalService.getHistoricalPrices('bitcoin');

      const callArgs = mockedAxios.get.mock.calls[0][1];
      const fromTimestamp = callArgs?.params.from;
      const toTimestamp = callArgs?.params.to;

      // Verify that we have a 30-day range (approximately)
      const timeDiff = (toTimestamp - fromTimestamp) * 1000; // Convert to milliseconds
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      
      expect(daysDiff).toBeCloseTo(30, 0);
    });
  });

  describe('calculateMovingAverage', () => {
    it('should calculate simple moving average correctly', () => {
      const prices = [
        { timestamp: 1, price: 100 },
        { timestamp: 2, price: 110 },
        { timestamp: 3, price: 105 },
        { timestamp: 4, price: 115 },
        { timestamp: 5, price: 120 }
      ];

      const result = historicalService.calculateMovingAverage(prices, 3);

      expect(result).toEqual([
        { timestamp: 3, price: 105 }, // (100+110+105)/3
        { timestamp: 4, price: 110 }, // (110+105+115)/3
        { timestamp: 5, price: 113.33 } // (105+115+120)/3
      ]);
    });

    it('should return empty array when period is larger than data', () => {
      const prices = [
        { timestamp: 1, price: 100 },
        { timestamp: 2, price: 110 }
      ];

      const result = historicalService.calculateMovingAverage(prices, 5);

      expect(result).toEqual([]);
    });

    it('should handle empty price array', () => {
      const result = historicalService.calculateMovingAverage([], 3);
      expect(result).toEqual([]);
    });
  });

  describe('calculatePriceVolatility', () => {
    it('should calculate price volatility correctly', () => {
      const prices = [
        { timestamp: 1, price: 100 },
        { timestamp: 2, price: 110 },
        { timestamp: 3, price: 90 },
        { timestamp: 4, price: 105 }
      ];

      const result = historicalService.calculatePriceVolatility(prices);

      // Standard deviation calculation
      // Mean = (100+110+90+105)/4 = 101.25
      // Variance = ((100-101.25)² + (110-101.25)² + (90-101.25)² + (105-101.25)²)/4
      // Expected result should be around 7.39
      expect(result).toBeCloseTo(7.39, 1);
    });

    it('should return 0 for single price point', () => {
      const prices = [{ timestamp: 1, price: 100 }];
      const result = historicalService.calculatePriceVolatility(prices);
      expect(result).toBe(0);
    });

    it('should handle empty price array', () => {
      const result = historicalService.calculatePriceVolatility([]);
      expect(result).toBe(0);
    });
  });
});