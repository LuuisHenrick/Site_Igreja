import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Package, Calendar, Image, Home } from 'lucide-react';
import { Logo } from './ui/Logo';

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Members', icon: Users, href: '/members' },
  { name: 'Finance', icon: DollarSign, href: '/finance' },
  { name: 'Education', icon: BookOpen, href: '/education' },
  { name: 'Assets', icon: Package, href: '/assets' },
  { name: 'Calendar', icon: Calendar, href: '/calendar' },
  { name: 'Media', icon: Image, href: '/media' },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-sm min-h-screen">
      <div className="p-4 flex items-center">
        <Logo variant="icon" className="mr-2" />
        <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
      </div>
      <nav className="mt-4 px-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};