import axios from 'axios';
import { CryptoService } from './cryptoService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CryptoService', () => {
  let cryptoService: CryptoService;

  beforeEach(() => {
    cryptoService = new CryptoService();
    jest.clearAllMocks();
  });

  describe('getTopCryptocurrencies', () => {
    it('should fetch top cryptocurrencies successfully', async () => {
      const mockData = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 45000,
          price_change_percentage_24h: 2.5,
          market_cap: 850000000000,
          total_volume: 25000000000,
          last_updated: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          current_price: 3000,
          price_change_percentage_24h: -1.2,
          market_cap: 360000000000,
          total_volume: 15000000000,
          last_updated: '2024-01-01T00:00:00.000Z'
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await cryptoService.getTopCryptocurrencies(10);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h,7d'
          }
        }
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 45000,
        price_change_percentage_24h: 2.5,
        market_cap: 850000000000,
        volume_24h: 25000000000,
        last_updated: '2024-01-01T00:00:00.000Z'
      });
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(cryptoService.getTopCryptocurrencies(10)).rejects.toThrow('Failed to fetch cryptocurrency data');
    });

    it('should use default limit when none provided', async () => {
      mockedAxios.get.mockResolvedValue({ data: [] });

      await cryptoService.getTopCryptocurrencies();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 50,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h,7d'
          }
        }
      );
    });
  });

  describe('getCryptocurrencyById', () => {
    it('should fetch specific cryptocurrency by id', async () => {
      const mockData = {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        market_data: {
          current_price: { usd: 45000 },
          price_change_percentage_24h: 2.5,
          market_cap: { usd: 850000000000 },
          total_volume: { usd: 25000000000 }
        },
        last_updated: '2024-01-01T00:00:00.000Z'
      };

      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await cryptoService.getCryptocurrencyById('bitcoin');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin'
      );

      expect(result).toEqual({
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 45000,
        price_change_percentage_24h: 2.5,
        market_cap: 850000000000,
        volume_24h: 25000000000,
        last_updated: '2024-01-01T00:00:00.000Z'
      });
    });

    it('should handle API errors when fetching specific cryptocurrency', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Not found'));

      await expect(cryptoService.getCryptocurrencyById('invalid-id')).rejects.toThrow('Failed to fetch cryptocurrency data');
    });
  });
});