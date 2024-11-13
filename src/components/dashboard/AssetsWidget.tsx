import React from 'react';
import { useStore } from '../../lib/store';
import { Package, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export const AssetsWidget: React.FC = () => {
  const store = useStore();

  const totalValue = store.assets.reduce((sum, asset) => sum + asset.value, 0);
  const maintenanceAssets = store.assets.filter(a => a.status === 'Maintenance');
  const recentAssets = store.assets
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Assets Overview</h2>
        <Package className="h-5 w-5 text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Assets</p>
          <p className="mt-1 text-xl font-semibold text-indigo-600">
            {store.assets.length}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="mt-1 text-xl font-semibold text-green-600">
            {formatCurrency(totalValue)}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">In Maintenance</p>
            {maintenanceAssets.length > 0 && (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
          </div>
          <p className="mt-1 text-xl font-semibold text-yellow-600">
            {maintenanceAssets.length}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Recently Added Assets</h3>
        <div className="space-y-4">
          {recentAssets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{asset.name}</p>
                <p className="text-sm text-gray-500">{asset.category}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(asset.value)}</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  asset.status === 'Available' ? 'bg-green-100 text-green-800' :
                  asset.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {asset.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};