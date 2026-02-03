import { ReloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Empty, Row, Spin, Statistic } from 'antd';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getDashboardStats } from '../api/dashboard';

const COLORS = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#4facfe',
  '#00f2fe',
  '#43e97b',
  '#fa709a',
  '#fee140',
];

const Dashboard = () => {
  const {
    data: stats,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardStats,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (queryError || !stats) {
    return (
      <Card>
        <Empty
          description="Failed to load dashboard statistics"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  const categoryData = Object.entries(stats.category_breakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Number.parseFloat(value.toFixed(2)),
  }));

  const monthlyData = stats.monthly_trends.map((item) => ({
    month: `${item.month}/${item.year}`,
    total: Number.parseFloat(item.total.toFixed(2)),
    count: item.count,
  }));

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold m-0">Dashboard</h2>
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh Data
          </Button>
        </div>

        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Expenses"
                value={stats.total_expenses}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#667eea' } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Count"
                value={stats.total_count}
                styles={{ content: { color: '#764ba2' } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Average Expense"
                value={stats.average_expense}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#43e97b' } }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Category Breakdown" className="h-full">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={false}
                      outerRadius={120}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      iconType="circle"
                      formatter={(value, entry) => {
                        const payloadValue = entry?.payload?.value;
                        if (typeof payloadValue === 'number') {
                          const percent = (
                            (payloadValue / stats.total_expenses) *
                            100
                          ).toFixed(1);
                          return `${value} (${percent}%)`;
                        }
                        return value;
                      }}
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty
                  description="No category data available"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Monthly Trends (Last 6 Months)" className="h-full">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="total" fill="#667eea" name="Total Expenses ($)" />
                    <Bar dataKey="count" fill="#764ba2" name="Number of Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty
                  description="No monthly data available"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;
