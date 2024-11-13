import React, { useState } from 'react';
import { 
  useReactTable, 
  createColumnHelper, 
  getCoreRowModel, 
  flexRender,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Users, Search, Edit2, Trash2, Eye, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../lib/store';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { GroupForm } from './GroupForm';
import type { Group } from '../../lib/store';
import { format } from 'date-fns';

interface GroupListProps {
  groups: Group[];
  onSelectGroup: (id: string) => void;
}

const columnHelper = createColumnHelper<Group>();

export const GroupList: React.FC<GroupListProps> = ({ groups, onSelectGroup }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const store = useStore();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('members', {
      header: 'Members',
      cell: info => info.getValue().length,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue() === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: info => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectGroup(info.row.original.id)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleEdit(info.row.original.id)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Edit2 className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: groups,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleAdd = (data: Omit<Group, 'id' | 'createdAt' | 'members'>) => {
    const newGroup = {
      ...data,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
      members: [],
    };
    store.addGroup(newGroup);
    setIsAddModalOpen(false);
    toast.success('Group created successfully');
  };

  const handleEdit = (id: string) => {
    setSelectedGroupId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      store.deleteGroup(id);
      toast.success('Group deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={e => table.getColumn('name')?.setFilterValue(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={UserPlus}
        >
          Create Group
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center space-x-1">
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getIsSorted() && (
                          {asc: <ChevronUp className="h-4 w-4" />, desc: <ChevronDown className="h-4 w-4" />}[header.column.getIsSorted() as string]
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Group"
      >
        <GroupForm onSubmit={handleAdd} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGroupId(null);
        }}
        title="Edit Group"
      >
        {selectedGroupId && (
          <GroupForm
            group={groups.find(g => g.id === selectedGroupId)}
            onSubmit={(data) => {
              store.updateGroup(selectedGroupId, data);
              setIsEditModalOpen(false);
              setSelectedGroupId(null);
              toast.success('Group updated successfully');
            }}
          />
        )}
      </Modal>
    </div>
  );
};