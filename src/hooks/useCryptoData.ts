import { useState, useEffect, useCallback } from 'react';
import { CryptoCurrency, PriceHistory, TrendPrediction } from '../types/crypto';
import { CryptoService } from '../services/cryptoService';
import { HistoricalService } from '../services/historicalService';
import { PredictionService } from '../services/predictionService';

interface UseCryptoDataReturn {
  currencies: CryptoCurrency[];
  historicalData: PriceHistory | null;
  prediction: TrendPrediction | null;
  loading: {
    currencies: boolean;
    historical: boolean;
    prediction: boolean;
  };
  error: {
    currencies: string | null;
    historical: string | null;
    prediction: string | null;
  };
  fetchCurrencies: (limit?: number) => Promise<void>;
  fetchHistoricalData: (symbol: string, days?: number) => Promise<void>;
  fetchPrediction: (symbol: string, timeHorizon?: '1h' | '24h' | '7d') => Promise<void>;
}

export const useCryptoData = (): UseCryptoDataReturn => {
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [historicalData, setHistoricalData] = useState<PriceHistory | null>(null);
  const [prediction, setPrediction] = useState<TrendPrediction | null>(null);
  
  const [loading, setLoading] = useState({
    currencies: false,
    historical: false,
    prediction: false
  });
  
  const [error, setError] = useState({
    currencies: null as string | null,
    historical: null as string | null,
    prediction: null as string | null
  });

  const cryptoService = new CryptoService();
  const historicalService = new HistoricalService();
  const predictionService = new PredictionService();

  const fetchCurrencies = useCallback(async (limit: number = 10) => {
    setLoading(prev => ({ ...prev, currencies: true }));
    setError(prev => ({ ...prev, currencies: null }));
    
    try {
      const data = await cryptoService.getTopCryptocurrencies(limit);
      setCurrencies(data);
    } catch (err) {
      setError(prev => ({ ...prev, currencies: 'Failed to fetch cryptocurrency data' }));
    } finally {
      setLoading(prev => ({ ...prev, currencies: false }));
    }
  }, []);

  const fetchHistoricalData = useCallback(async (symbol: string, days: number = 30) => {
    setLoading(prev => ({ ...prev, historical: true }));
    setError(prev => ({ ...prev, historical: null }));
    
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
      const data = await historicalService.getHistoricalPrices(symbol, startDate, endDate);
      setHistoricalData(data);
    } catch (err) {
      setError(prev => ({ ...prev, historical: 'Failed to fetch historical data' }));
    } finally {
      setLoading(prev => ({ ...prev, historical: false }));
    }
  }, []);

  const fetchPrediction = useCallback(async (symbol: string, timeHorizon: '1h' | '24h' | '7d' = '24h') => {
    if (!historicalData || historicalData.prices.length === 0) {
      setError(prev => ({ ...prev, prediction: 'Historical data required for prediction' }));
      return;
    }

    setLoading(prev => ({ ...prev, prediction: true }));
    setError(prev => ({ ...prev, prediction: null }));
    
    try {
      const predictionData = predictionService.predictPriceTrend(symbol, historicalData.prices, timeHorizon);
      setPrediction(predictionData);
    } catch (err) {
      setError(prev => ({ ...prev, prediction: 'Failed to generate prediction' }));
    } finally {
      setLoading(prev => ({ ...prev, prediction: false }));
    }
  }, [historicalData]);

  // Auto-fetch top cryptocurrencies on mount
  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    currencies,
    historicalData,
    prediction,
    loading,
    error,
    fetchCurrencies,
    fetchHistoricalData,
    fetchPrediction
  };
};