import React from 'react';
import { useStore } from '../../lib/store';
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

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const ModulesSummary: React.FC = () => {
  const store = useStore();

  // Member statistics
  const memberStats = [
    { name: 'Active', value: store.members.filter(m => m.status === 'Active').length },
    { name: 'Inactive', value: store.members.filter(m => m.status === 'Inactive').length },
  ];

  // Event statistics
  const eventStats = [
    { name: 'Regular', value: store.events.length },
    { name: 'Education', value: store.educationEvents.length },
  ];

  // Media statistics by type
  const mediaStats = store.mediaFiles.reduce((acc, file) => {
    acc[file.type] = (acc[file.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mediaData = Object.entries(mediaStats).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Module Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members Distribution */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Member Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memberStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {memberStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Media Distribution */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Media Files by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mediaData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};