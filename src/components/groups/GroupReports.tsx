import React, { useState } from 'react';
import { Download, Filter, PieChart } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Group } from '../../lib/store';
import * as XLSX from 'xlsx';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

interface GroupReportsProps {
  groups: Group[];
}

type FilterCriteria = {
  category?: string;
  status?: string;
};

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const GroupReports: React.FC<GroupReportsProps> = ({ groups }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filteredGroups = groups.filter(group => {
    if (filters.category && group.category !== filters.category) return false;
    if (filters.status && group.status !== filters.status) return false;
    return true;
  });

  const categoryStats = React.useMemo(() => {
    const stats = groups.reduce((acc, group) => {
      acc[group.category] = (acc[group.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([name, value]) => ({
      name,
      value,
    }));
  }, [groups]);

  const generateExcel = () => {
    const data = filteredGroups.map(group => ({
      'Name': group.name,
      'Category': group.category,
      'Status': group.status,
      'Members Count': group.members.length,
      'Meeting Day': group.meetingSchedule?.day || 'N/A',
      'Meeting Time': group.meetingSchedule?.time || 'N/A',
      'Meeting Location': group.meetingSchedule?.location || 'N/A',
      'Created At': new Date(group.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Groups');
    XLSX.writeFile(wb, 'groups-report.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Group Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={filters.category || ''}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value || undefined }))}
            >
              <option value="">All Categories</option>
              <option value="Cell Group">Cell Group</option>
              <option value="Ministry">Ministry</option>
              <option value="Department">Department</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={filters.status || ''}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined }))}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredGroups.length} groups found
          </p>
          <Button
            onClick={generateExcel}
            icon={Download}
          >
            Export to Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Groups by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {categoryStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Group Statistics</h3>
          <div className="space-y-4">
             <boltAction type="file" filePath="src/components/groups/GroupReports.tsx">            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Groups</p>
                <p className="text-2xl font-semibold text-indigo-600">{groups.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Active Groups</p>
                <p className="text-2xl font-semibold text-green-600">
                  {groups.filter(g => g.status === 'active').length}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Average Members</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {Math.round(groups.reduce((acc, g) => acc + g.members.length, 0) / groups.length) || 0}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Members</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {groups.reduce((acc, g) => acc + g.members.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Detailed Group List
          </h3>
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {filteredGroups.map((group) => (
              <li key={group.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{group.name}</p>
                    <p className="text-sm text-gray-500">{group.category}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {group.members.length} members
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                </div>
                {group.meetingSchedule && (
                  <div className="mt-2 text-sm text-gray-500">
                    Meets on {group.meetingSchedule.day} at {group.meetingSchedule.time}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};