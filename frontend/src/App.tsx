import { Layout } from 'antd';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Dashboard from './components/Dashboard';
import ExchangeRate from './components/ExchangeRate';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

const { Content } = Layout;

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Layout className="min-h-screen">
        <AppHeader />
        <Content className="p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<ExpenseList />} />
              <Route path="/expenses/new" element={<ExpenseForm />} />
              <Route path="/expenses/:id/edit" element={<ExpenseForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/exchange" element={<ExchangeRate />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
