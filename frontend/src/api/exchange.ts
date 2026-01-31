import type { ExchangeRateResponse } from '../types';
import client from './client';

export const getExchangeRates = async (baseCurrency = 'USD') => {
  const response = await client.get(`/api/exchange/rates/${baseCurrency}`);
  return response.data;
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<ExchangeRateResponse> => {
  const response = await client.get<ExchangeRateResponse>('/api/exchange/convert', {
    params: {
      amount,
      from_currency: fromCurrency,
      to_currency: toCurrency,
    },
  });
  return response.data;
};
