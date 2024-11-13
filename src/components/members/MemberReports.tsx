import React, { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Member } from '../../lib/store';
import * as XLSX from 'xlsx';

interface MemberReportsProps {
  members: Member[];
}

type FilterCriteria = {
  role?: string;
  status?: string;
  category?: string;
  baptized?: boolean;
};

export const MemberReports: React.FC<MemberReportsProps> = ({ members }) => {
  const [filters, setFilters] = useState<FilterCriteria>({});

  const filteredMembers = members.filter(member => {
    if (filters.role && member.role !== filters.role) return false;
    if (filters.status && member.status !== filters.status) return false;
    if (filters.category && member.category !== filters.category) return false;
    if (filters.baptized !== undefined && member.isBaptized !== filters.baptized) return false;
    return true;
  });

  const generateExcel = () => {
    const data = filteredMembers.map(member => ({
      'Name': member.name,
      'Email': member.email,
      'Phone': member.phone,
      'Role': member.role,
      'Category': member.category,
      'Status': member.status,
      'Birth Date': new Date(member.birthDate).toLocaleDateString(),
      'Address': `${member.address.street}, ${member.address.number}, ${member.address.city}`,
      'Baptized': member.isBaptized ? 'Yes' : 'No',
      'Baptism Date': member.baptismDate ? new Date(member.baptismDate).toLocaleDateString() : 'N/A',
      'Conversion Date': member.conversionDate ? new Date(member.conversionDate).toLocaleDateString() : 'N/A',
      'Created At': new Date(member.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    XLSX.writeFile(wb, 'members-report.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Member Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={filters.role || ''}
              onChange={(e) => setFilters(f => ({ ...f, role: e.target.value || undefined }))}
            >
              <option value="">All Roles</option>
              <option value="Member">Member</option>
              <option value="Leader">Leader</option>
              <option value="Pastor">Pastor</option>
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={filters.category || ''}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value || undefined }))}
            >
              <option value="">All Categories</option>
              <option value="Regular Member">Regular Member</option>
              <option value="Ministry Leader">Ministry Leader</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Baptism Status</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={filters.baptized === undefined ? '' : filters.baptized.toString()}
              onChange={(e) => setFilters(f => ({ 
                ...f, 
                baptized: e.target.value === '' ? undefined : e.target.value === 'true'
              }))}
            >
              <option value="">All</option>
              <option value="true">Baptized</option>
              <option value="false">Not Baptized</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredMembers.length} members found
          </p>
          <Button
            onClick={generateExcel}
            icon={Download}
          >
            Export to Excel
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Filtered Members List
          </h3>
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <li key={member.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={member.photo || 'https://via.placeholder.com/40'}
                    alt={member.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {member.status}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};