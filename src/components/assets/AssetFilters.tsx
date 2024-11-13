import React from 'react';
import { Filter } from 'lucide-react';

interface AssetFiltersProps {
  selectedCategory: string;
  selectedStatus: string;
  selectedLocation: string;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onLocationChange: (location: string) => void;
}

const categories = [
  'All Assets',
  'Equipment',
  'Furniture',
  'Digital',
  'Vehicles',
  'Musical Instruments',
  'Office Equipment',
];

const statuses = [
  'All',
  'Available',
  'In Use',
  'Maintenance',
  'Reserved',
  'Retired',
  'Disposed',
];

const locations = [
  'All',
  'Main Sanctuary',
  'Fellowship Hall',
  'Office',
  'Storage',
  'Youth Room',
  'Kitchen',
];

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  selectedCategory,
  selectedStatus,
  selectedLocation,
  onCategoryChange,
  onStatusChange,
  onLocationChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <Filter className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                  category === selectedCategory
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
          <div className="space-y-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                  status === selectedStatus
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
          <div className="space-y-2">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => onLocationChange(location)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                  location === selectedLocation
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};