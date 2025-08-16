import axios from 'axios';
import { CryptoCurrency } from '../types/crypto';

export class CryptoService {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';

  async getTopCryptocurrencies(limit: number = 50): Promise<CryptoCurrency[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h,7d'
        }
      });

      return response.data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_7d: coin.price_change_percentage_7d,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        volume_24h: coin.total_volume,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        max_supply: coin.max_supply,
        ath: coin.ath,
        atl: coin.atl,
        image: coin.image,
        last_updated: coin.last_updated
      }));
    } catch (error) {
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }

  async getCryptocurrencyById(id: string): Promise<CryptoCurrency> {
    try {
      const response = await axios.get(`${this.baseUrl}/coins/${id}`);
      const coin = response.data;

      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        current_price: coin.market_data.current_price.usd,
        price_change_percentage_24h: coin.market_data.price_change_percentage_24h,
        market_cap: coin.market_data.market_cap.usd,
        volume_24h: coin.market_data.total_volume.usd,
        last_updated: coin.last_updated
      };
    } catch (error) {
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }
}