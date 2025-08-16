import { HistoricalPrice, TrendPrediction } from '../types/crypto';

interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

export class PredictionService {
  predictPriceTrend(
    symbol: string,
    prices: HistoricalPrice[],
    timeHorizon: '1h' | '24h' | '7d'
  ): TrendPrediction {
    if (prices.length < 2) {
      return {
        symbol,
        current_price: prices[0]?.price || 0,
        predicted_price: prices[0]?.price || 0,
        confidence: 0,
        trend_direction: 'neutral',
        time_horizon: timeHorizon
      };
    }

    const currentPrice = prices[prices.length - 1].price;
    const regression = this.calculateLinearRegression(prices);
    const rsi = this.calculateRSI(prices);
    
    // Simple prediction based on linear regression
    const nextTimestamp = prices[prices.length - 1].timestamp + 1;
    const predictedPrice = regression.slope * nextTimestamp + regression.intercept;
    
    // Determine trend direction
    let trendDirection: 'bullish' | 'bearish' | 'neutral';
    const priceChangePercent = ((predictedPrice - currentPrice) / currentPrice) * 100;
    
    if (Math.abs(priceChangePercent) < 2) {
      trendDirection = 'neutral';
    } else if (priceChangePercent > 0) {
      trendDirection = 'bullish';
    } else {
      trendDirection = 'bearish';
    }
    
    // Calculate confidence based on R-squared and trend strength
    let confidence = regression.rSquared;
    
    // Adjust confidence based on RSI
    if (rsi > 70 || rsi < 30) {
      confidence *= 0.8; // Reduce confidence in extreme RSI conditions
    }
    
    // Reduce confidence for neutral trends
    if (trendDirection === 'neutral') {
      confidence *= 0.5;
    }
    
    confidence = Math.max(0, Math.min(1, confidence));

    return {
      symbol,
      current_price: currentPrice,
      predicted_price: Math.round(predictedPrice * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      trend_direction: trendDirection,
      time_horizon: timeHorizon
    };
  }

  calculateLinearRegression(prices: HistoricalPrice[]): LinearRegressionResult {
    if (prices.length < 2) {
      return { slope: 0, intercept: 0, rSquared: 0 };
    }

    const n = prices.length;
    const x = prices.map((_, index) => index);
    const y = prices.map(price => price.price);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    
    const rSquared = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

    return {
      slope: isNaN(slope) ? 0 : slope,
      intercept: isNaN(intercept) ? 0 : intercept,
      rSquared: isNaN(rSquared) ? 0 : Math.max(0, rSquared)
    };
  }

  calculateRSI(prices: HistoricalPrice[], period: number = 14): number {
    if (prices.length < period + 1) {
      return 50; // Return neutral RSI when insufficient data
    }

    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i].price - prices[i - 1].price);
    }

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain and loss
    for (let i = 0; i < period; i++) {
      if (changes[i] > 0) {
        gains += changes[i];
      } else {
        losses += Math.abs(changes[i]);
      }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate subsequent RSI values using Wilder's smoothing
    for (let i = period; i < changes.length; i++) {
      const change = changes[i];
      
      if (change > 0) {
        avgGain = (avgGain * (period - 1) + change) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
      }
    }

    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return Math.round(rsi * 100) / 100;
  }
}