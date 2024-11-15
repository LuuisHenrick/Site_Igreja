import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Video, FileText, Upload, Search, Filter, Grid, List, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { MediaUploader } from '../components/media/MediaUploader';
import { MediaGrid } from '../components/media/MediaGrid';
import { MediaList } from '../components/media/MediaList';
import { MediaEditForm } from '../components/media/MediaEditForm';

export const Media: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Files');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const store = useStore();
  const mediaFiles = store.mediaFiles || [];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Files' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    store.deleteMediaFile(id);
    toast.success('File deleted successfully');
  };

  const handleEdit = (id: string) => {
    setSelectedFile(id);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <Button
          icon={Upload}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Files
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
            <nav className="space-y-2">
              {['All Files', 'Images', 'Videos', 'Documents'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                    category === selectedCategory
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-400 hover:text-gray-500">
                    <Filter className="h-5 w-5" />
                  </button>
                  <div className="border-l border-gray-200 h-6" />
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <MediaGrid
                files={filteredFiles}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ) : (
              <MediaList
                files={filteredFiles}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Files"
      >
        <MediaUploader
          onUploadComplete={(files) => {
            files.forEach(file => store.addMediaFile(file));
            setIsUploadModalOpen(false);
            toast.success('Files uploaded successfully');
          }}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFile(null);
        }}
        title="Edit File"
      >
        {selectedFile && (
          <MediaEditForm
            file={mediaFiles.find(f => f.id === selectedFile)!}
            onSave={(updatedFile) => {
              store.updateMediaFile(selectedFile, updatedFile);
              setIsEditModalOpen(false);
              setSelectedFile(null);
              toast.success('File updated successfully');
            }}
          />
        )}
      </Modal>
    </div>
  );
};