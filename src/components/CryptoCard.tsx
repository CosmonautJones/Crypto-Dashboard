import React from 'react';
import { CryptoCurrency } from '../types/crypto';
import { Tooltip } from './Tooltip';
import { TrendingUp, TrendingDown, ExternalLink, Star, BarChart3 } from 'lucide-react';

interface CryptoCardProps {
  crypto: CryptoCurrency;
  isSelected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({
  crypto,
  isSelected = false,
  onClick,
  showDetails = false
}) => {
  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-danger';
    return 'text-gray-400';
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatSupply = (supply: number | undefined) => {
    if (!supply) return 'N/A';
    return formatLargeNumber(supply);
  };

  return (
    <div 
      className={`
        card cursor-pointer transform transition-all duration-300 hover:scale-102 hover:shadow-xl group
        ${isSelected ? 'bg-primary-600 ring-2 ring-primary-400' : 'hover:bg-gray-750'}
        ${showDetails ? 'p-6' : 'p-4'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {crypto.image && (
            <img 
              src={crypto.image} 
              alt={crypto.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{crypto.name}</h3>
              {crypto.market_cap_rank && crypto.market_cap_rank <= 10 && (
                <Tooltip content="Top 10 cryptocurrency by market cap">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </Tooltip>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</span>
              {crypto.market_cap_rank && (
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                  #{crypto.market_cap_rank}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-semibold text-white">
            ${crypto.current_price.toLocaleString()}
          </div>
          <div className={`flex items-center gap-1 justify-end ${getPriceChangeColor(crypto.price_change_percentage_24h)}`}>
            {getPriceChangeIcon(crypto.price_change_percentage_24h)}
            <span className="text-sm font-medium">
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-3 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4">
            <Tooltip content="Total market value of all coins in circulation">
              <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="text-xs text-gray-400 mb-1">Market Cap</div>
                <div className="font-semibold text-white">
                  ${formatLargeNumber(crypto.market_cap)}
                </div>
              </div>
            </Tooltip>
            
            <Tooltip content="Total trading volume in the last 24 hours">
              <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="text-xs text-gray-400 mb-1">24h Volume</div>
                <div className="font-semibold text-white">
                  ${formatLargeNumber(crypto.volume_24h)}
                </div>
              </div>
            </Tooltip>
          </div>

          {(crypto.circulating_supply || crypto.total_supply || crypto.max_supply) && (
            <div className="grid grid-cols-3 gap-2">
              {crypto.circulating_supply && (
                <Tooltip content="Number of coins currently in circulation">
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <div className="text-xs text-gray-400">Circulating</div>
                    <div className="text-sm font-medium text-white">
                      {formatSupply(crypto.circulating_supply)}
                    </div>
                  </div>
                </Tooltip>
              )}
              
              {crypto.total_supply && (
                <Tooltip content="Total number of coins that exist">
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <div className="text-xs text-gray-400">Total</div>
                    <div className="text-sm font-medium text-white">
                      {formatSupply(crypto.total_supply)}
                    </div>
                  </div>
                </Tooltip>
              )}
              
              {crypto.max_supply && (
                <Tooltip content="Maximum number of coins that will ever exist">
                  <div className="text-center p-2 bg-gray-700 rounded">
                    <div className="text-xs text-gray-400">Max</div>
                    <div className="text-sm font-medium text-white">
                      {formatSupply(crypto.max_supply)}
                    </div>
                  </div>
                </Tooltip>
              )}
            </div>
          )}

          {(crypto.ath || crypto.atl) && (
            <div className="flex gap-4">
              {crypto.ath && (
                <Tooltip content="All-time highest price">
                  <div className="flex-1 bg-green-900/20 border border-green-700 p-3 rounded-lg">
                    <div className="text-xs text-green-400 mb-1">All-Time High</div>
                    <div className="font-semibold text-white">
                      ${crypto.ath.toLocaleString()}
                    </div>
                  </div>
                </Tooltip>
              )}
              
              {crypto.atl && (
                <Tooltip content="All-time lowest price">
                  <div className="flex-1 bg-red-900/20 border border-red-700 p-3 rounded-lg">
                    <div className="text-xs text-red-400 mb-1">All-Time Low</div>
                    <div className="font-semibold text-white">
                      ${crypto.atl.toLocaleString()}
                    </div>
                  </div>
                </Tooltip>
              )}
            </div>
          )}

          {(crypto.price_change_percentage_7d !== undefined) && (
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-400">7-day change</span>
              <div className={`flex items-center gap-1 ${getPriceChangeColor(crypto.price_change_percentage_7d)}`}>
                {getPriceChangeIcon(crypto.price_change_percentage_7d)}
                <span className="font-medium">
                  {crypto.price_change_percentage_7d.toFixed(2)}%
                </span>
              </div>
            </div>
          )}

          {(crypto.homepage || crypto.blockchain_site) && (
            <div className="flex gap-2 pt-2 border-t border-gray-700">
              {crypto.homepage && (
                <Tooltip content="Visit official website">
                  <a 
                    href={crypto.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Website
                  </a>
                </Tooltip>
              )}
              
              {crypto.blockchain_site && (
                <Tooltip content="View blockchain explorer">
                  <a 
                    href={crypto.blockchain_site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BarChart3 className="w-3 h-3" />
                    Explorer
                  </a>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};