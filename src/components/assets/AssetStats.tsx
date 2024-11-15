import React from 'react';
import { Package, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { Asset } from '../../lib/store';

interface AssetStatsProps {
  assets: Asset[];
}

export const AssetStats: React.FC<AssetStatsProps> = ({ assets }) => {
  const stats = React.useMemo(() => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalAssets = assets.length;
    const availableAssets = assets.filter(a => a.status === 'Available').length;
    const maintenanceAssets = assets.filter(a => a.status === 'Maintenance').length;

    return [
      {
        label: 'Total Assets',
        value: totalAssets,
        icon: Package,
        color: 'indigo',
      },
      {
        label: 'Total Value',
        value: formatCurrency(totalValue),
        icon: DollarSign,
        color: 'green',
      },
      {
        label: 'Available Assets',
        value: availableAssets,
        icon: CheckCircle,
        color: 'blue',
      },
      {
        label: 'In Maintenance',
        value: maintenanceAssets,
        icon: AlertCircle,
        color: 'yellow',
      },
    ];
  }, [assets]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};