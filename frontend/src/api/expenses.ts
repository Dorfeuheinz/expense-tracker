import type { Expense, ExpenseCreate } from '../types';
import client from './client';

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await client.get<Expense[]>('/api/expenses/');
  return response.data;
};

export const getExpense = async (id: number): Promise<Expense> => {
  const response = await client.get<Expense>(`/api/expenses/${id}`);
  return response.data;
};

export const createExpense = async (expense: ExpenseCreate): Promise<Expense> => {
  const response = await client.post<Expense>('/api/expenses/', expense);
  return response.data;
};

export const updateExpense = async (
  id: number,
  expense: Partial<ExpenseCreate>
): Promise<Expense> => {
  const response = await client.put<Expense>(`/api/expenses/${id}`, expense);
  return response.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await client.delete(`/api/expenses/${id}`);
};
