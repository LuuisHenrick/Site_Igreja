import React, { useState } from 'react';
import { Image, Video, FileText, Edit2, Trash2, Folder, ChevronRight, ChevronDown, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatFileSize } from '../../lib/utils';
import { Button } from '../ui/Button';
import type { MediaFile } from '../../lib/store';

interface MediaListProps {
  files: MediaFile[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

interface FolderStructure {
  [key: string]: MediaFile[];
}

export const MediaList: React.FC<MediaListProps> = ({ files, onDelete, onEdit }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['All Files']));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'document'>('all');

  const getTypeIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || file.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filesByFolder = filteredFiles.reduce((acc: FolderStructure, file) => {
    const folder = file.category || 'Uncategorized';
    if (!acc[folder]) {
      acc[folder] = [];
    }
    acc[folder].push(file);
    return acc;
  }, {});

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
            className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(filesByFolder).map(([folder, folderFiles]) => (
          <div key={folder} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleFolder(folder)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2">
                <Folder className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">{folder}</h3>
                <span className="text-sm text-gray-500">
                  ({folderFiles.length} {folderFiles.length === 1 ? 'file' : 'files'})
                </span>
              </div>
              {expandedFolders.has(folder) ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedFolders.has(folder) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="divide-y divide-gray-200">
                    {folderFiles.map((file) => (
                      <div key={file.id} className="p-4 flex items-center hover:bg-gray-50">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                          {file.thumbnail ? (
                            <img
                              src={file.thumbnail}
                              alt={file.title}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            getTypeIcon(file.type)
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{file.title}</h3>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{formatFileSize(parseInt(file.size))}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <button
                            onClick={() => onEdit(file.id)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Edit2 className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => onDelete(file.id)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};