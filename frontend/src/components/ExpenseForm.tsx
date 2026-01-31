import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createExpense, getExpense, updateExpense } from '../api/expenses';
import { ExpenseCategory, type ExpenseCreate } from '../types';

const { TextArea } = Input;
const { Option } = Select;

interface FormValues {
  title: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  expense_date: dayjs.Dayjs;
}

const ExpenseForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isEdit = !!id;

  const expenseId = id ? Number.parseInt(id, 10) : null;

  const { data: expense, isLoading: loadingExpense } = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: () => {
      if (expenseId === null) throw new Error('Expense ID is required');
      return getExpense(expenseId);
    },
    enabled: isEdit && expenseId !== null && !Number.isNaN(expenseId),
  });

  useEffect(() => {
    if (expense) {
      form.setFieldsValue({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        description: expense.description || '',
        expense_date: dayjs(expense.expense_date),
      });
    }
  }, [expense, form]);

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      message.success('Expense created successfully');
      navigate('/');
    },
    onError: () => {
      message.error('Failed to create expense');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExpenseCreate> }) =>
      updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['expense', expenseId] });
      message.success('Expense updated successfully');
      navigate('/');
    },
    onError: () => {
      message.error('Failed to update expense');
    },
  });

  const handleSubmit = (values: FormValues) => {
    const formData: ExpenseCreate = {
      title: values.title,
      amount: values.amount,
      category: values.category,
      description: values.description || '',
      expense_date: values.expense_date.format('YYYY-MM-DD'),
    };

    if (isEdit && expenseId !== null && !Number.isNaN(expenseId)) {
      updateMutation.mutate({ id: expenseId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (loadingExpense && isEdit) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{isEdit ? 'Edit Expense' : 'Add New Expense'}</span>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
            Back
          </Button>
        </div>
      }
      className="max-w-2xl mx-auto shadow-lg"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          category: ExpenseCategory.FOOD,
          expense_date: dayjs(),
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter expense title" size="large" />
        </Form.Item>

        <Space.Compact className="w-full" orientation="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Amount ($)"
              name="amount"
              rules={[
                { required: true, message: 'Please enter an amount' },
                { type: 'number', min: 0.01, message: 'Amount must be greater than 0' },
              ]}
            >
              <InputNumber
                placeholder="0.00"
                prefix="$"
                min={0.01}
                step={0.01}
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select size="large" placeholder="Select category">
                {Object.values(ExpenseCategory).map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Space.Compact>

        <Form.Item
          label="Date"
          name="expense_date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker className="w-full" size="large" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea
            rows={4}
            placeholder="Enter description (optional)"
            maxLength={1000}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={loading}
            >
              {isEdit ? 'Update Expense' : 'Create Expense'}
            </Button>
            <Button size="large" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ExpenseForm;
