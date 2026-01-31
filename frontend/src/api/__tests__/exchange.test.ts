import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { convertCurrency, getExchangeRates } from '../exchange';

const mockGet = mock(() => Promise.resolve({ data: {} }));

mock.module('../client', () => ({
  default: {
    get: mockGet,
  },
}));

describe('Exchange API', () => {
  beforeEach(() => {
    mockGet.mockClear();
  });

  describe('getExchangeRates', () => {
    it('fetches exchange rates for a base currency', async () => {
      const mockRates = {
        base: 'USD',
        date: '2024-01-01',
        rates: {
          EUR: 0.85,
          GBP: 0.75,
        },
      };

      mockGet.mockResolvedValueOnce({ data: mockRates });

      const result = await getExchangeRates('USD');

      expect(mockGet).toHaveBeenCalledWith('/api/exchange/rates/USD');
      expect(result).toEqual(mockRates);
    });
  });

  describe('convertCurrency', () => {
    it('converts currency', async () => {
      const mockConversion = {
        base_currency: 'USD',
        target_currency: 'EUR',
        rate: 0.85,
        amount: 100,
        converted_amount: 85.0,
      };

      mockGet.mockResolvedValueOnce({ data: mockConversion });

      const result = await convertCurrency(100, 'USD', 'EUR');

      expect(mockGet).toHaveBeenCalledWith('/api/exchange/convert', {
        params: {
          amount: 100,
          from_currency: 'USD',
          to_currency: 'EUR',
        },
      });
      expect(result).toEqual(mockConversion);
    });
  });
});
