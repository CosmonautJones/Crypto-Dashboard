import React from 'react';
import { Tooltip } from './Tooltip';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  className?: string;
  animated?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  tooltip,
  icon,
  trend,
  loading = false,
  className = '',
  animated = true
}) => {
  const getTrendColor = () => {
    if (change !== undefined) {
      if (change > 0) return 'text-success';
      if (change < 0) return 'text-danger';
      return 'text-gray-400';
    }
    
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-danger';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = () => {
    if (change !== undefined) {
      if (change > 0) return <TrendingUp className="w-4 h-4" />;
      if (change < 0) return <TrendingDown className="w-4 h-4" />;
      return <Minus className="w-4 h-4" />;
    }
    
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1e9) {
        return `$${(val / 1e9).toFixed(2)}B`;
      } else if (val >= 1e6) {
        return `$${(val / 1e6).toFixed(2)}M`;
      } else if (val >= 1e3) {
        return `$${(val / 1e3).toFixed(2)}K`;
      }
      return `$${val.toLocaleString()}`;
    }
    return val;
  };

  if (loading) {
    return (
      <div className={`card ${className} ${animated ? 'animate-pulse' : ''}`}>
        <div className="h-4 bg-gray-700 rounded mb-3"></div>
        <div className="h-8 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className={`card ${className} ${animated ? 'transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-750' : ''} group`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          {tooltip && (
            <Tooltip content={tooltip} position="top">
              <Info className="w-4 h-4 text-gray-500 hover:text-gray-300 transition-colors cursor-help" />
            </Tooltip>
          )}
        </div>
        {icon && (
          <div className={`${animated ? 'transform transition-transform duration-300 group-hover:scale-110' : ''}`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`text-2xl font-bold text-white ${animated ? 'transition-colors duration-300' : ''}`}>
          {formatValue(value)}
        </span>
        
        {(change !== undefined || trend) && (
          <div className={`flex items-center gap-1 ${getTrendColor()} ${animated ? 'transition-all duration-300' : ''}`}>
            {getTrendIcon()}
            {change !== undefined && (
              <span className="text-sm font-medium">
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            )}
            {changeLabel && (
              <span className="text-xs text-gray-400 ml-1">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};