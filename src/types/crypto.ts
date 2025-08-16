export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  market_cap: number;
  market_cap_rank?: number;
  volume_24h: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  ath?: number;
  atl?: number;
  image?: string;
  last_updated: string;
  description?: string;
  homepage?: string;
  blockchain_site?: string;
}

export interface HistoricalPrice {
  timestamp: number;
  price: number;
}

export interface PriceHistory {
  symbol: string;
  prices: HistoricalPrice[];
}

export interface TrendPrediction {
  symbol: string;
  current_price: number;
  predicted_price: number;
  confidence: number;
  trend_direction: 'bullish' | 'bearish' | 'neutral';
  time_horizon: '1h' | '24h' | '7d';
}