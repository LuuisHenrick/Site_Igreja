import React from 'react';

interface Stat {
  label: string;
  value: string;
  trend: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500">{stat.label}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <span className="ml-2 text-sm font-medium text-green-600">{stat.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
};