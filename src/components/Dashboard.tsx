import React, { useState, useEffect } from 'react';
import { PriceChart } from './PriceChart';
import { StatCard } from './StatCard';
import { CryptoCard } from './CryptoCard';
import { Tooltip } from './Tooltip';
import { useCryptoData } from '../hooks/useCryptoData';
import { TrendingUp, TrendingDown, Minus, RefreshCw, DollarSign, BarChart3, Activity, Zap } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    currencies,
    historicalData,
    prediction,
    loading,
    error,
    fetchHistoricalData,
    fetchPrediction
  } = useCryptoData();

  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedCrypto) {
      fetchHistoricalData(selectedCrypto, 7);
    }
  }, [selectedCrypto, fetchHistoricalData]);

  useEffect(() => {
    if (historicalData && selectedCrypto) {
      fetchPrediction(selectedCrypto, '24h');
    }
  }, [historicalData, selectedCrypto, fetchPrediction]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (selectedCrypto) {
      await fetchHistoricalData(selectedCrypto, 7);
    }
    setRefreshing(false);
  };


  const selectedCurrency = currencies.find(c => c.id === selectedCrypto);

  return (
    <div className="space-y-6">
      {/* Header with crypto selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Live Crypto Dashboard</h2>
          <p className="text-gray-400">Real-time data, analysis, and predictions</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Tooltip content="Select a cryptocurrency to view detailed charts, predictions, and market data. Data updates automatically.">
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:border-gray-600"
            >
              {currencies.map(crypto => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </Tooltip>
          
          <Tooltip content="Refresh historical data and predictions. Data automatically updates every few minutes, but you can manually refresh anytime.">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading.historical}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Current price and stats */}
      {selectedCurrency && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Current Price"
            value={selectedCurrency.current_price}
            icon={<DollarSign className="w-5 h-5 text-primary-400" />}
            tooltip="Real-time price from CoinGecko API. Updates automatically every few seconds."
            className="hover-lift"
          />
          
          <StatCard
            title="24h Change"
            value={`${selectedCurrency.price_change_percentage_24h.toFixed(2)}%`}
            change={selectedCurrency.price_change_percentage_24h}
            icon={<Activity className="w-5 h-5 text-gray-400" />}
            tooltip="Percentage change in price over the last 24 hours. Green indicates gains, red indicates losses."
            className="hover-lift"
          />
          
          <StatCard
            title="Market Cap"
            value={selectedCurrency.market_cap}
            icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
            tooltip="Total market value of all coins in circulation. Calculated as current price × circulating supply."
            className="hover-lift"
          />
          
          <StatCard
            title="24h Volume"
            value={selectedCurrency.volume_24h}
            icon={<Zap className="w-5 h-5 text-yellow-400" />}
            tooltip="Total value of coins traded in the last 24 hours. Higher volume indicates more active trading."
            className="hover-lift"
          />
        </div>
      )}

      {/* Price chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart
            data={historicalData?.prices || []}
            title={`${selectedCurrency?.name || 'Cryptocurrency'} Price Chart (7 days)`}
            height={400}
            loading={loading.historical}
            error={error.historical || undefined}
            showMovingAverage={true}
            trend={prediction?.trend_direction}
          />
        </div>
        
        {/* Prediction panel */}
        <div className="space-y-4">
          <div className="card glass-effect">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-white">AI Prediction</h3>
              <Tooltip content="Advanced price prediction using linear regression, RSI analysis, and technical indicators. Predictions are based on historical data patterns.">
                <Activity className="w-4 h-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
              </Tooltip>
            </div>
            
            {loading.prediction ? (
              <div className="text-center text-gray-400">Analyzing trends...</div>
            ) : error.prediction ? (
              <div className="text-center text-danger">{error.prediction}</div>
            ) : prediction ? (
              <div className="space-y-4">
                <Tooltip content="Predicted price for the next 24 hours based on linear regression analysis of recent price movements.">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-help">
                    <span className="text-gray-400">24h Prediction:</span>
                    <span className="text-xl font-semibold text-white">
                      ${prediction.predicted_price.toLocaleString()}
                    </span>
                  </div>
                </Tooltip>
                
                <Tooltip content="Market trend direction based on technical analysis. Bullish = upward, Bearish = downward, Neutral = sideways movement.">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-help">
                    <span className="text-gray-400">Trend:</span>
                    <div className={`flex items-center gap-2 ${
                      prediction.trend_direction === 'bullish' ? 'text-success' :
                      prediction.trend_direction === 'bearish' ? 'text-danger' : 'text-gray-400'
                    }`}>
                      {prediction.trend_direction === 'bullish' && <TrendingUp className="w-4 h-4" />}
                      {prediction.trend_direction === 'bearish' && <TrendingDown className="w-4 h-4" />}
                      {prediction.trend_direction === 'neutral' && <Minus className="w-4 h-4" />}
                      <span className="capitalize font-medium">{prediction.trend_direction}</span>
                    </div>
                  </div>
                </Tooltip>
                
                <Tooltip content="Confidence level of the prediction based on data quality, trend strength, and RSI indicators. Higher is more reliable.">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-help">
                    <span className="text-gray-400">Confidence:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-600 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${prediction.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {(prediction.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </Tooltip>
                
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300">
                    Based on technical analysis, the algorithm predicts a{' '}
                    <span className={`font-medium ${
                      prediction.trend_direction === 'bullish' ? 'text-success' :
                      prediction.trend_direction === 'bearish' ? 'text-danger' : 'text-gray-400'
                    }`}>
                      {prediction.trend_direction}
                    </span>{' '}
                    trend with {(prediction.confidence * 100).toFixed(0)}% confidence.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">Select a cryptocurrency to view predictions</div>
            )}
          </div>
          
          {/* Top cryptocurrencies list */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-white">Top Cryptocurrencies</h3>
              <Tooltip content="Top cryptocurrencies by market capitalization. Click any crypto to view detailed charts and predictions.">
                <BarChart3 className="w-4 h-4 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
              </Tooltip>
            </div>
            
            {loading.currencies ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-700 h-16 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {currencies.slice(0, 5).map((crypto, index) => (
                  <div key={crypto.id} className="animate-in" style={{animationDelay: `${index * 100}ms`}}>
                    <CryptoCard
                      crypto={crypto}
                      isSelected={selectedCrypto === crypto.id}
                      onClick={() => setSelectedCrypto(crypto.id)}
                      showDetails={selectedCrypto === crypto.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};