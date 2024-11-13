import React, { useState } from 'react';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { AssetForm } from '../components/assets/AssetForm';
import { AssetView } from '../components/assets/AssetView';
import { AssetList } from '../components/assets/AssetList';
import { AssetStats } from '../components/assets/AssetStats';
import { AssetFilters } from '../components/assets/AssetFilters';
import { AssetCharts } from '../components/assets/AssetCharts';
import { generateAssetReport } from '../utils/reports';

export const Assets: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Assets');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [showCharts, setShowCharts] = useState(false);

  const store = useStore();
  const assets = store.assets || [];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Assets' || asset.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || asset.status === selectedStatus;
    const matchesLocation = selectedLocation === 'All' || asset.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const handleAdd = (data: Omit<Asset, 'id'>) => {
    const newAsset = {
      ...data,
      id: Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: 'Current User', // Replace with actual user data
    };
    store.addAsset(newAsset);
    setIsAddModalOpen(false);
    toast.success('Asset added successfully');
  };

  const handleEdit = (id: string) => {
    setSelectedAsset(id);
    setIsEditModalOpen(true);
  };

  const handleView = (id: string) => {
    setSelectedAsset(id);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      store.deleteAsset(id);
      toast.success('Asset deleted successfully');
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      await generateAssetReport(filteredAssets, format);
      toast.success(`Report exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Assets Management</h1>
        <div className="flex space-x-4">
          <Button
            variant="secondary"
            icon={Filter}
            onClick={() => setShowCharts(!showCharts)}
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleExport('excel')}
          >
            Export Excel
          </Button>
          <Button
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Asset
          </Button>
        </div>
      </div>

      <AssetStats assets={assets} />

      {showCharts && <AssetCharts assets={assets} />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <AssetFilters
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            selectedLocation={selectedLocation}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            onLocationChange={setSelectedLocation}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <AssetList
              assets={filteredAssets}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Asset"
      >
        <AssetForm onSubmit={handleAdd} />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedAsset(null);
        }}
        title="Asset Details"
      >
        {selectedAsset && (
          <AssetView
            asset={assets.find(a => a.id === selectedAsset)!}
            onEdit={() => {
              setIsViewModalOpen(false);
              handleEdit(selectedAsset);
            }}
            onDelete={() => {
              handleDelete(selectedAsset);
              setIsViewModalOpen(false);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAsset(null);
        }}
        title="Edit Asset"
      >
        {selectedAsset && (
          <AssetForm
            asset={assets.find(a => a.id === selectedAsset)}
            onSubmit={(data) => {
              store.updateAsset(selectedAsset, {
                ...data,
                lastModifiedAt: new Date().toISOString(),
                lastModifiedBy: 'Current User', // Replace with actual user data
              });
              setIsEditModalOpen(false);
              setSelectedAsset(null);
              toast.success('Asset updated successfully');
            }}
          />
        )}
      </Modal>
    </div>
  );
};