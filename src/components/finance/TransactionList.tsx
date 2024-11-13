import React, { useMemo } from 'react';
import { DollarSign, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { FinancialRecord } from '../../lib/store';

interface TransactionListProps {
  transactions: FinancialRecord[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
  onEdit,
}) => {
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {sortedTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${
                transaction.type === 'income'
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUp className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowDown className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${
                transaction.type === 'income'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(transaction.id)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Edit transaction"
                >
                  <Edit2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Delete transaction"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};