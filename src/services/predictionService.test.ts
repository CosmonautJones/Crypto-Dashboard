import { PredictionService } from './predictionService';
import { HistoricalPrice } from '../types/crypto';

describe('PredictionService', () => {
  let predictionService: PredictionService;

  beforeEach(() => {
    predictionService = new PredictionService();
  });

  describe('predictPriceTrend', () => {
    it('should predict bullish trend for upward price movement', () => {
      const prices: HistoricalPrice[] = [
        { timestamp: 1, price: 100 },
        { timestamp: 2, price: 105 },
        { timestamp: 3, price: 110 },
        { timestamp: 4, price: 115 },
        { timestamp: 5, price: 120 }
      ];

      const result = predictionService.predictPriceTrend('bitcoin', prices, '24h');

      expect(result.symbol).toBe('bitcoin');
      expect(result.current_price).toBe(120);
      expect(result.trend_direction).toBe('bullish');
      expect(result.time_horizon).toBe('24h');
      expect(result.predicted_price).toBeGreaterThan(120);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should predict bearish trend for downward price movement', () => {
      const prices: HistoricalPrice[] = [
        { timestamp: 1, price: 120 },
        { timestamp: 2, price: 115 },
        { timestamp: 3, price: 110 },
        { timestamp: 4, price: 105 },
        { timestamp: 5, price: 100 }
      ];

      const result = predictionService.predictPriceTrend('ethereum', prices, '1h');

      expect(result.symbol).toBe('ethereum');
      expect(result.current_price).toBe(100);
      expect(result.trend_direction).toBe('bearish');
      expect(result.time_horizon).toBe('1h');
      expect(result.predicted_price).toBeLessThan(100);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should predict neutral trend for sideways price movement', () => {
      const prices: HistoricalPrice[] = [
        { timestamp: 1, price: 100 },
        { timestamp: 2, price: 101 },
        { timestamp: 3, price: 99 },
        { timestamp: 4, price: 100.5 },
        { timestamp: 5, price: 99.5 }
      ];

      const result = predictionService.predictPriceTrend('bitcoin', prices, '7d');

      expect(result.symbol).toBe('bitcoin');
      expect(result.current_price).toBe(99.5);
      expect(result.trend_direction).toBe('neutral');
      expect(result.time_horizon).toBe('7d');
      expect(result.confidence).toBeLessThan(0.7);
    });

    it('should handle insufficient data gracefully', () => {
      const prices: HistoricalPrice[] = [
        { timestamp: 1, price: 100 }
      ];

      const result = predictionService.predictPriceTrend('bitcoin', prices, '24h');

      expect(result.symbol).toBe('bitcoin');
      expect(result.current_price).toBe(100);
      expect(result.trend_direction).toBe('neutral');
      expect(result.confidence).toBe(0);
    });
  });

  describe('calculateLinearRegression', () => {
    it('should calculate linear regression correctly', () => {
      const prices: HistoricalPrice[] = [
        { timestamp: 1, price: 100 },
        { timestamp: 2, price: 110 },
        { timestamp: 3, price: 120 },
        { timestamp: 4, price: 130 },
        { timestamp: 5, price: 140 }
      ];

      const result = predictionService.calculateLinearRegression(prices);

      expect(result.slope).toBeCloseTo(10, 0); // Price increases by ~10 per time unit
      expect(result.intercept).toBeCloseTo(100, 0); // Y-intercept when x=0
      expect(result.rSquared).toBeCloseTo(1, 1); // Perfect linear relationship
    });

    it('should handle flat prices', () => {
      const prices: HistoricalPrice[] = [
        { timestamp: 1, price: 100 },
        { timestamp: 2, price: 100 },
        { timestamp: 3, price: 100 },
        { timestamp: 4, price: 100 }
      ];

      const result = predictionService.calculateLinearRegression(prices);

      expect(result.slope).toBeCloseTo(0, 2);
      expect(result.intercept).toBeCloseTo(100, 0);
      expect(result.rSquared).toBeCloseTo(0, 2);
    });

    it('should handle empty data', () => {
      const result = predictionService.calculateLinearRegression([]);

      expect(result.slope).toBe(0);
      expect(result.intercept).toBe(0);
      expect(result.rSquared).toBe(0);
    });
  });

  describe('calculateRSI', () => {
    it('should calculate RSI correctly for overbought condition', () => {
      // Prices showing strong upward trend (should result in high RSI)
      const prices: HistoricalPrice[] = [
        { timestamp: 1, price: 100 },
        { timestamp: 2, price: 105 },
        { timestamp: 3, price: 110 },
        { timestamp: 4, price: 115 },
        { timestamp: 5, price: 120 },
        { timestamp: 6, price: 125 },
        { timestamp: 7, price: 130 },
        { timestamp: 8, price: 135 },
        { timestamp: 9, price: 140 },
        { timestamp: 10, price: 145 },
        { timestamp: 11, price: 150 },
        { timestamp: 12, price: 155 },
        { timestamp: 13, price: 160 },
        { timestamp: 14, price: 165 },
        { timestamp: 15, price: 170 }
      ];

      const result = predictionService.calculateRSI(prices);

      expect(result).toBeGreaterThan(70); // RSI > 70 indicates overbought
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should handle insufficient data for RSI calculation', () => {
      const prices: HistoricalPrice[] = [
        { timestamp: 1, price: 100 },
        { timestamp: 2, price: 105 }
      ];

      const result = predictionService.calculateRSI(prices);

      expect(result).toBe(50); // Default neutral RSI when insufficient data
    });

    it('should handle empty data', () => {
      const result = predictionService.calculateRSI([]);

      expect(result).toBe(50);
    });
  });
});