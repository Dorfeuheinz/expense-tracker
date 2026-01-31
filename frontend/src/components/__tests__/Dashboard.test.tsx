import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock TanStack Query
const mockUseQuery = mock(() => ({
  data: null,
  isLoading: false,
  error: null,
  refetch: mock(),
}));

mock.module('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    mockUseQuery.mockClear();
  });

  it('renders loading state', () => {
    mockUseQuery.mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
      refetch: mock(),
    });

    const { container } = render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Dashboard />
      </BrowserRouter>
    );

    // Check for Spin component (Ant Design loading indicator)
    const spinElement = container.querySelector('.ant-spin');
    expect(spinElement).toBeInTheDocument();
  });

  it('renders dashboard with statistics', async () => {
    const mockStats = {
      total_expenses: 1000.0,
      total_count: 10,
      average_expense: 100.0,
      category_breakdown: {
        food: 500.0,
      },
      monthly_trends: [],
    };

    mockUseQuery.mockReturnValueOnce({
      data: mockStats,
      isLoading: false,
      error: null,
      refetch: mock(),
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Use screen queries which work better with async rendering
    const dashboardHeading = await screen.findByText('Dashboard');
    expect(dashboardHeading).toBeInTheDocument();

    const totalExpenses = await screen.findByText('Total Expenses');
    expect(totalExpenses).toBeInTheDocument();
  });
});
