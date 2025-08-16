import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { HistoricalPrice } from '../types/crypto';

interface PriceChartProps {
  data: HistoricalPrice[];
  title: string;
  height: number;
  loading?: boolean;
  error?: string;
  showMovingAverage?: boolean;
  trend?: 'bullish' | 'bearish' | 'neutral';
}

interface ChartDataPoint {
  timestamp: number;
  price: number;
  formattedDate: string;
  movingAverage?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  title,
  height,
  loading = false,
  error,
  showMovingAverage = false,
  trend
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const formattedData: ChartDataPoint[] = data.map(point => ({
      timestamp: point.timestamp,
      price: point.price,
      formattedDate: format(new Date(point.timestamp), 'MMM dd, HH:mm')
    }));

    // Calculate moving average if requested
    if (showMovingAverage && data.length >= 5) {
      const period = Math.min(5, data.length);
      
      formattedData.forEach((point, index) => {
        if (index >= period - 1) {
          const slice = formattedData.slice(index - period + 1, index + 1);
          const average = slice.reduce((sum, p) => sum + p.price, 0) / period;
          point.movingAverage = Math.round(average * 100) / 100;
        }
      });
    }

    return formattedData;
  }, [data, showMovingAverage]);

  const getTrendIcon = () => {
    switch (trend) {
      case 'bullish':
        return <span className="text-success text-xl">↗</span>;
      case 'bearish':
        return <span className="text-danger text-xl">↘</span>;
      case 'neutral':
        return <span className="text-gray-400 text-xl">→</span>;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'bullish':
        return '#10b981';
      case 'bearish':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-gray-400">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-danger">{error}</div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-gray-400">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {getTrendIcon()}
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              name === 'price' ? 'Price' : 'Moving Average'
            ]}
          />
          <Legend />
          
          <Line
            type="monotone"
            dataKey="price"
            stroke={getTrendColor()}
            strokeWidth={2}
            dot={false}
            name="Price"
            connectNulls
          />
          
          {showMovingAverage && (
            <Line
              type="monotone"
              dataKey="movingAverage"
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="Moving Average"
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};