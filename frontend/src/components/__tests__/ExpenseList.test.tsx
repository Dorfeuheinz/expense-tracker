import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ExpenseCategory } from '../../types';
import ExpenseList from '../ExpenseList';

// Mock TanStack Query
const mockUseQuery = mock(() => ({
  data: [],
  isLoading: false,
  error: null,
}));

const mockUseMutation = mock(() => ({
  mutate: mock(),
  isPending: false,
  error: null,
}));

const mockUseQueryClient = mock(() => ({
  invalidateQueries: mock(),
}));

mock.module('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
  useMutation: mockUseMutation,
  useQueryClient: mockUseQueryClient,
}));

// Mock Ant Design message
const mockMessage = {
  success: mock(),
  error: mock(),
  warning: mock(),
};

mock.module('antd', () => ({
  message: mockMessage,
}));

describe('ExpenseList', () => {
  const mockExpenses = [
    {
      id: 1,
      title: 'Test Expense',
      amount: 50.0,
      category: ExpenseCategory.FOOD,
      description: 'Test description',
      expense_date: '2024-01-15',
      created_at: '2024-01-15T10:00:00Z',
    },
  ];

  beforeEach(() => {
    mockUseQuery.mockClear();
    mockUseMutation.mockClear();
  });

  it('renders loading state initially', () => {
    mockUseQuery.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { container } = render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ExpenseList />
      </BrowserRouter>
    );

    // Check for Spin component (Ant Design loading indicator)
    const spinElement = container.querySelector('.ant-spin');
    expect(spinElement).toBeInTheDocument();
  });

  it('renders expenses list', async () => {
    mockUseQuery.mockReturnValueOnce({
      data: mockExpenses,
      isLoading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ExpenseList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Expense')).toBeInTheDocument();
    });
  });

  it('renders empty state when no expenses', async () => {
    mockUseQuery.mockReturnValueOnce({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <ExpenseList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No expenses yet/i)).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    mockUseQuery.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: new Error('API Error'),
    });

    render(
      <BrowserRouter>
        <ExpenseList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load expenses/i)).toBeInTheDocument();
    });
  });
});
