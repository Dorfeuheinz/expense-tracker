import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { ExpenseCategory } from '../../types';
import { createExpense, deleteExpense, getExpense, getExpenses, updateExpense } from '../expenses';

// Mock the client module
const mockGet = mock(() => Promise.resolve({ data: [] }));
const mockPost = mock(() => Promise.resolve({ data: {} }));
const mockPut = mock(() => Promise.resolve({ data: {} }));
const mockDelete = mock(() => Promise.resolve(undefined));

mock.module('../client', () => ({
  default: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
  },
}));

describe('Expenses API', () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockPost.mockClear();
    mockPut.mockClear();
    mockDelete.mockClear();
  });

  describe('getExpenses', () => {
    it('fetches all expenses', async () => {
      const mockExpenses = [
        {
          id: 1,
          title: 'Test',
          amount: 50,
          category: ExpenseCategory.FOOD,
          expense_date: '2024-01-15',
          created_at: '2024-01-15T10:00:00Z',
        },
      ];

      mockGet.mockResolvedValueOnce({ data: mockExpenses });

      const result = await getExpenses();

      expect(mockGet).toHaveBeenCalledWith('/api/expenses/');
      expect(result).toEqual(mockExpenses);
    });
  });

  describe('getExpense', () => {
    it('fetches a single expense by ID', async () => {
      const mockExpense = {
        id: 1,
        title: 'Test',
        amount: 50,
        category: ExpenseCategory.FOOD,
        expense_date: '2024-01-15',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockGet.mockResolvedValueOnce({ data: mockExpense });

      const result = await getExpense(1);

      expect(mockGet).toHaveBeenCalledWith('/api/expenses/1');
      expect(result).toEqual(mockExpense);
    });
  });

  describe('createExpense', () => {
    it('creates a new expense', async () => {
      const newExpense = {
        title: 'New Expense',
        amount: 75,
        category: ExpenseCategory.TRANSPORT,
        expense_date: '2024-01-15',
      };

      const mockResponse = {
        ...newExpense,
        id: 1,
        created_at: '2024-01-15T10:00:00Z',
      };

      mockPost.mockResolvedValueOnce({ data: mockResponse });

      const result = await createExpense(newExpense);

      expect(mockPost).toHaveBeenCalledWith('/api/expenses/', newExpense);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateExpense', () => {
    it('updates an existing expense', async () => {
      const updateData = { title: 'Updated Title' };
      const mockResponse = {
        id: 1,
        title: 'Updated Title',
        amount: 50,
        category: ExpenseCategory.FOOD,
        expense_date: '2024-01-15',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockPut.mockResolvedValueOnce({ data: mockResponse });

      const result = await updateExpense(1, updateData);

      expect(mockPut).toHaveBeenCalledWith('/api/expenses/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteExpense', () => {
    it('deletes an expense', async () => {
      mockDelete.mockResolvedValueOnce(undefined);

      await deleteExpense(1);

      expect(mockDelete).toHaveBeenCalledWith('/api/expenses/1');
    });
  });
});
