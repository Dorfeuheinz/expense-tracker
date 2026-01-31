import { DashboardOutlined, DollarOutlined, SwapOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DollarOutlined />,
      label: <Link to="/">Expenses</Link>,
    },
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/exchange',
      icon: <SwapOutlined />,
      label: <Link to="/exchange">Currency Converter</Link>,
    },
  ];

  return (
    <Header className="bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-white text-xl font-bold flex items-center gap-2">
          <DollarOutlined className="text-2xl" />
          Expense Tracker
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="bg-transparent border-none flex-1 justify-end"
          style={{ lineHeight: '64px' }}
        />
      </div>
    </Header>
  );
};

export default AppHeader;
