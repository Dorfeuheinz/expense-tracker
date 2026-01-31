import type { DashboardStats } from '../types';
import client from './client';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await client.get<DashboardStats>('/api/dashboard/stats');
  return response.data;
};
