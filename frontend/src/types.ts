export enum ExpenseCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  BILLS = 'bills',
  HEALTH = 'health',
  EDUCATION = 'education',
  OTHER = 'other',
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  expense_date: string;
  created_at: string;
  updated_at?: string;
}

export interface ExpenseCreate {
  title: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  expense_date: string;
}

export interface DashboardStats {
  total_expenses: number;
  category_breakdown: Record<string, number>;
  monthly_trends: Array<{
    year: number;
    month: number;
    total: number;
    count: number;
  }>;
  average_expense: number;
  total_count: number;
}

export interface ExchangeRateResponse {
  base_currency: string;
  target_currency: string;
  rate: number;
  amount: number;
  converted_amount: number;
}
