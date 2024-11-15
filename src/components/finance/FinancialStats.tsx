import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface FinancialStatsProps {
  stats: {
    totalIncome: number;
    totalExpenses: number;
    recentTransactions: number;
    pendingApprovals: number;
  };
}

export const FinancialStats: React.FC<FinancialStatsProps> = ({ stats }) => {
  const {
    netBalance,
    netBalancePercentage,
    balanceStatus
  } = useMemo(() => {
    const netBalance = stats.totalIncome - stats.totalExpenses;
    const netBalancePercentage = stats.totalIncome === 0 ? 0 :
      ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100;
    
    let balanceStatus: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (netBalance > 0) balanceStatus = 'positive';
    if (netBalance < 0) balanceStatus = 'negative';

    return { netBalance, netBalancePercentage, balanceStatus };
  }, [stats.totalIncome, stats.totalExpenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Income</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {formatCurrency(stats.totalIncome)}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {formatCurrency(stats.totalExpenses)}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Net Balance</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {formatCurrency(netBalance)}
            </p>
            <p className={`text-sm ${
              balanceStatus === 'positive' ? 'text-green-600' :
              balanceStatus === 'negative' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {netBalancePercentage.toFixed(1)}%
            </p>
          </div>
          <div className={`p-3 rounded-full ${
            balanceStatus === 'positive' ? 'bg-green-100' :
            balanceStatus === 'negative' ? 'bg-red-100' :
            'bg-gray-100'
          }`}>
            <DollarSign className={`h-6 w-6 ${
              balanceStatus === 'positive' ? 'text-green-600' :
              balanceStatus === 'negative' ? 'text-red-600' :
              'text-gray-600'
            }`} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {stats.pendingApprovals}
            </p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
};