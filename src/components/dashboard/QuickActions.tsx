import React from 'react';
import { UserPlus, Calendar, DollarSign, Bell, Users, BookOpen, Package, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: UserPlus,
      label: 'Add Member',
      onClick: () => navigate('/members'),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Calendar,
      label: 'Schedule Event',
      onClick: () => navigate('/calendar'),
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: DollarSign,
      label: 'Record Transaction',
      onClick: () => navigate('/finance'),
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Bell,
      label: 'Send Notification',
      onClick: () => navigate('/notifications'),
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const modules = [
    {
      icon: Users,
      label: 'Members',
      description: 'Manage church members',
      path: '/members',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: BookOpen,
      label: 'Education',
      description: 'Manage courses and events',
      path: '/education',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Package,
      label: 'Assets',
      description: 'Track church assets',
      path: '/assets',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Image,
      label: 'Media',
      description: 'Manage media files',
      path: '/media',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <div className={`p-3 rounded-lg ${action.color}`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="mt-2 text-sm font-medium text-gray-900">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((module) => (
          <button
            key={module.label}
            onClick={() => navigate(module.path)}
            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className={`inline-flex p-2 rounded-lg ${module.color}`}>
              <module.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{module.label}</h3>
            <p className="mt-1 text-xs text-gray-500">{module.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};