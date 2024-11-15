import React, { useEffect } from 'react';
import { useStore } from '../lib/store';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ModulesSummary } from '../components/dashboard/ModulesSummary';
import { BirthdayWidget } from '../components/dashboard/BirthdayWidget';
import { UpcomingEventsWidget } from '../components/dashboard/UpcomingEventsWidget';
import { FinancialWidget } from '../components/dashboard/FinancialWidget';
import { AssetsWidget } from '../components/dashboard/AssetsWidget';
import { ExportReports } from '../components/dashboard/ExportReports';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const store = useStore();
  
  useEffect(() => {
    store.fetchInitialData();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (store.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (store.error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading dashboard data: {store.error}</p>
      </div>
    );
  }

  // Calculate summary statistics with null checks
  const stats = [
    {
      label: 'Total Members',
      value: store.members?.length || 0,
      trend: '+12%',
      description: 'Active church members'
    },
    {
      label: 'Events',
      value: (store.events?.length || 0) + (store.educationEvents?.length || 0),
      trend: '+5%',
      description: 'Scheduled events'
    },
    {
      label: 'Media Files',
      value: store.mediaFiles?.length || 0,
      trend: '+8%',
      description: 'Uploaded files'
    },
    {
      label: 'Assets',
      value: store.assets?.length || 0,
      trend: '+3%',
      description: 'Registered assets'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Grace Church Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening in your church today</p>
        </div>
        <div className="text-sm text-gray-500">
          {currentDate}
        </div>
      </div>

      {/* Stats Overview */}
      <StatsGrid stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Module Summaries */}
        <div className="lg:col-span-2 space-y-6">
          <ModulesSummary />
          <FinancialWidget />
          <AssetsWidget />
        </div>

        {/* Right Column - Widgets */}
        <div className="space-y-6">
          <BirthdayWidget />
          <UpcomingEventsWidget />
          <ExportReports />
        </div>
      </div>
    </div>
  );
};