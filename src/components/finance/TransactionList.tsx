import React from 'react';
import { Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { FinancialRecord } from "../../types/FinancialRecord.ts";

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
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(transaction.date)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {transaction.type === 'income' ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUp className="h-4 w-4 mr-1" /> Income
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <ArrowDown className="h-4 w-4 mr-1" /> Expense
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {transaction.category}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {transaction.description}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatCurrency(transaction.amount)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => onEdit(transaction.id)}
                className="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(transaction.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};