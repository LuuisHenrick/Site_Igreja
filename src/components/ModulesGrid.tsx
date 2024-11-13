import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface Module {
  icon: LucideIcon;
  label: string;
  description: string;
}

interface ModulesGridProps {
  modules: Module[];
}

export const ModulesGrid: React.FC<ModulesGridProps> = ({ modules }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {modules.map((module, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <module.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{module.label}</h3>
                <p className="text-sm text-gray-500">{module.description}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};