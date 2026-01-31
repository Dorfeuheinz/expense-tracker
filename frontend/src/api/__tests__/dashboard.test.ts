import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { getDashboardStats } from '../dashboard';

const mockGet = mock(() => Promise.resolve({ data: {} }));

mock.module('../client', () => ({
  default: {
    get: mockGet,
  },
}));

describe('Dashboard API', () => {
  beforeEach(() => {
    mockGet.mockClear();
  });

  describe('getDashboardStats', () => {
    it('fetches dashboard statistics', async () => {
      const mockStats = {
        total_expenses: 1000.0,
        total_count: 10,
        average_expense: 100.0,
        category_breakdown: {
          food: 500.0,
          transport: 300.0,
          shopping: 200.0,
        },
        monthly_trends: [
          {
            year: 2024,
            month: 1,
            total: 500.0,
            count: 5,
          },
        ],
      };

      mockGet.mockResolvedValueOnce({ data: mockStats });

      const result = await getDashboardStats();

      expect(mockGet).toHaveBeenCalledWith('/api/dashboard/stats');
      expect(result).toEqual(mockStats);
    });
  });
});
