import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Empty, Popconfirm, Space, Spin, Table, Tag, message } from 'antd';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { deleteExpense, getExpenses } from '../api/expenses';
import { ExpenseCategory } from '../types';

const ExpenseList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: expenses = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      message.success('Expense deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete expense');
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: Record<ExpenseCategory, string> = {
      [ExpenseCategory.FOOD]: 'green',
      [ExpenseCategory.TRANSPORT]: 'blue',
      [ExpenseCategory.ENTERTAINMENT]: 'pink',
      [ExpenseCategory.SHOPPING]: 'orange',
      [ExpenseCategory.BILLS]: 'purple',
      [ExpenseCategory.HEALTH]: 'red',
      [ExpenseCategory.EDUCATION]: 'cyan',
      [ExpenseCategory.OTHER]: 'default',
    };
    return colors[category] || 'default';
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a: { amount: number }, b: { amount: number }) => a.amount - b.amount,
      className: 'font-semibold text-purple-600',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: ExpenseCategory) => (
        <Tag color={getCategoryColor(category)}>
          {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'expense_date',
      key: 'expense_date',
      render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
      sorter: (a: { expense_date: string }, b: { expense_date: string }) =>
        new Date(a.expense_date).getTime() - new Date(b.expense_date).getTime(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: { id: number }) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/expenses/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete expense"
            description="Are you sure you want to delete this expense?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (queryError) {
    return (
      <Card>
        <Empty
          description="Failed to load expenses. Please try again."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">My Expenses</span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/expenses/new')}
          >
            Add Expense
          </Button>
        </div>
      }
      className="shadow-lg"
    >
      {expenses.length === 0 ? (
        <Empty
          description="No expenses yet. Add your first expense to get started!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/expenses/new')}>
            Add Expense
          </Button>
        </Empty>
      ) : (
        <Table
          dataSource={expenses}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          className="mt-4"
        />
      )}
    </Card>
  );
};

export default ExpenseList;
