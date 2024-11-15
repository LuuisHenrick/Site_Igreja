import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Plus, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FinancialStats } from '../components/finance/FinancialStats';
import { TransactionForm } from '../components/finance/TransactionForm';
import { TransactionList } from '../components/finance/TransactionList';
import { FinancialCharts } from '../components/finance/FinancialCharts';

export const Finance: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');

  const store = useStore();
  const financialRecords = store.financialRecords || [];

  const filteredRecords = financialRecords.filter(record => {
    if (filterType === 'all') return true;
    return record.type === filterType;
  });

  const stats = {
    totalIncome: financialRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0),
    totalExpenses: financialRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0),
    recentTransactions: financialRecords.length,
    pendingApprovals: financialRecords.filter(r => r.status === 'pending').length,
  };

  const handleDelete = (id: string) => {
    store.deleteFinancialRecord(id);
    toast.success('Transaction deleted successfully');
  };

  const handleEdit = (id: string) => {
    setSelectedTransaction(id);
    setIsEditModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Type', 'Category', 'Description', 'Amount'].join(','),
      ...financialRecords.map(record => [
        record.date,
        record.type,
        record.category,
        record.description,
        record.amount,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Financial report exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
        <div className="flex space-x-4">
          <Button
            variant="secondary"
            icon={Download}
            onClick={handleExport}
          >
            Export Report
          </Button>
          <Button
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      <FinancialStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                    className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Transactions</option>
                    <option value="income">Income Only</option>
                    <option value="expense">Expenses Only</option>
                  </select>
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <TransactionList
              transactions={filteredRecords}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <FinancialCharts
            records={financialRecords}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSubmit={(data) => {
            store.addFinancialRecord({
              id: Math.random().toString(36).substring(2),
              ...data,
              date: new Date().toISOString(),
            });
            setIsAddModalOpen(false);
            toast.success('Transaction added successfully');
          }}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
        }}
        title="Edit Transaction"
      >
        {selectedTransaction && (
          <TransactionForm
            transaction={financialRecords.find(r => r.id === selectedTransaction)}
            onSubmit={(data) => {
              store.updateFinancialRecord(selectedTransaction, data);
              setIsEditModalOpen(false);
              setSelectedTransaction(null);
              toast.success('Transaction updated successfully');
            }}
          />
        )}
      </Modal>
    </div>
  );
};