import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import type { FinancialRecord } from '../../lib/store';

interface FinancialChartsProps {
  records: FinancialRecord[];
  dateRange: 'week' | 'month' | 'year';
  onDateRangeChange: (range: 'week' | 'month' | 'year') => void;
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6366F1'];

export const FinancialCharts: React.FC<FinancialChartsProps> = ({
  records,
  dateRange,
  onDateRangeChange,
}) => {
  const incomeByCategory = records
    .filter(r => r.type === 'income')
    .reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

  const expensesByCategory = records
    .filter(r => r.type === 'expense')
    .reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(incomeByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    amount: value,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Financial Overview</h2>
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value as typeof dateRange)}
          className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Income Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Expenses by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};