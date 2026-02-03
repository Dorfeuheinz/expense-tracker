import { SwapOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Col, InputNumber, Row, Select, Space, message } from 'antd';
import { useState } from 'react';
import { convertCurrency, getExchangeRates } from '../api/exchange';

const { Option } = Select;

const ExchangeRate = () => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');

  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  const { data: ratesData } = useQuery({
    queryKey: ['exchangeRates', 'USD'],
    queryFn: () => getExchangeRates('USD'),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const availableCurrencies = ratesData?.rates
    ? Object.keys(ratesData.rates).concat(['USD']).sort()
    : popularCurrencies;

  const convertMutation = useMutation({
    mutationFn: () => convertCurrency(amount, fromCurrency, toCurrency),
    onSuccess: () => {
      message.success('Currency converted successfully');
    },
    onError: () => {
      message.error('Failed to convert currency. Please try again.');
    },
  });

  const handleConvert = () => {
    if (amount <= 0) {
      message.warning('Amount must be greater than 0');
      return;
    }
    convertMutation.mutate();
  };

  const loading = convertMutation.isPending;
  const result = convertMutation.data || null;
  const currencies = availableCurrencies.length > 0 ? availableCurrencies : popularCurrencies;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <SwapOutlined className="text-2xl" />
          <span className="text-2xl font-bold">Currency Converter</span>
        </div>
      }
      className="max-w-4xl mx-auto shadow-lg"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Convert expense amounts between different currencies using real-time exchange rates. This
          demonstrates third-party API integration.
        </p>

        <Card>
          <Space orientation="vertical" className="w-full" size="large">
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <div className="space-y-2">
                  <span className="block font-medium">Amount</span>
                  <InputNumber
                    value={amount}
                    onChange={(value) => setAmount(value || 0)}
                    min={0}
                    step={0.01}
                    className="w-full"
                    size="large"
                    prefix="$"
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="space-y-2">
                  <span className="block font-medium">From Currency</span>
                  <Select
                    value={fromCurrency}
                    onChange={setFromCurrency}
                    className="w-full"
                    size="large"
                  >
                    {currencies.map((curr) => (
                      <Option key={curr} value={curr}>
                        {curr}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="space-y-2">
                  <span className="block font-medium">To Currency</span>
                  <Select
                    value={toCurrency}
                    onChange={setToCurrency}
                    className="w-full"
                    size="large"
                  >
                    {currencies.map((curr) => (
                      <Option key={curr} value={curr}>
                        {curr}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>

            <Button
              type="primary"
              icon={<SwapOutlined />}
              size="large"
              onClick={handleConvert}
              disabled={loading || amount <= 0}
              loading={loading}
              block
            >
              Convert
            </Button>
          </Space>
        </Card>

        {result && (
          <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold opacity-90">Conversion Result</h3>
              <div className="space-y-2">
                <p className="text-lg opacity-90">
                  {result.amount.toFixed(2)} {result.base_currency} =
                </p>
                <p className="text-4xl font-bold">
                  {result.converted_amount.toFixed(2)} {result.target_currency}
                </p>
                <p className="text-sm opacity-80 pt-4 border-t border-white/30">
                  Exchange Rate: 1 {result.base_currency} = {result.rate.toFixed(4)}{' '}
                  {result.target_currency}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">About This Feature</h3>
          <p className="text-gray-600">
            This currency converter integrates with the Exchange Rate API (exchangerate-api.com) to
            provide real-time currency conversion.
          </p>
        </Card>
      </div>
    </Card>
  );
};

export default ExchangeRate;
