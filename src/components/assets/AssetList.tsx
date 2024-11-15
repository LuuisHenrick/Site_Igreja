import React from 'react';
import { Package, Edit2, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../../lib/utils';

interface AssetListProps {
  assets: Asset[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AssetList: React.FC<AssetListProps> = ({
  assets,
  onView,
  onEdit,
  onDelete,
}) => {
  if (assets.length === 0) {
    return (
      <div className="p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new asset.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {assets.map((asset) => (
        <motion.div
          key={asset.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-6 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Package className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{asset.name}</h3>
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                  <span>{asset.category}</span>
                  <span>•</span>
                  <span>{asset.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {formatCurrency(asset.value)}
                </p>
                <p className="text-gray-500">
                  Acquired: {formatDate(asset.acquisitionDate)}
                </p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                asset.status === 'Available' ? 'bg-green-100 text-green-800' :
                asset.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                asset.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {asset.status}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onView(asset.id)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => onEdit(asset.id)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Edit2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => onDelete(asset.id)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
          {asset.description && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {asset.description}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};