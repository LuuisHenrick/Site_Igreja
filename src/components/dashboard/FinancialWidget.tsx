import React from 'react';
import { useStore } from '../../lib/store';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export const FinancialWidget: React.FC = () => {
  const store = useStore();

  const totalIncome = store.financialRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = store.financialRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Group transactions by date for the chart
  const chartData = store.financialRecords
    .reduce((acc, record) => {
      const date = record.date.split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, income: 0, expenses: 0 };
      }
      if (record.type === 'income') {
        acc[date].income += record.amount;
      } else {
        acc[date].expenses += record.amount;
      }
      return acc;
    }, {} as Record<string, { date: string; income: number; expenses: number }>);

  const lineChartData = Object.values(chartData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 days

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Financial Overview</h2>
        <DollarSign className="h-5 w-5 text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Income</p>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="mt-1 text-xl font-semibold text-green-600">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <p className="mt-1 text-xl font-semibold text-red-600">
            {formatCurrency(totalExpenses)}
          </p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Net Balance</p>
            {netBalance >= 0 ? (
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-indigo-600" />
            )}
          </div>
          <p className="mt-1 text-xl font-semibold text-indigo-600">
            {formatCurrency(netBalance)}
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineChartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};