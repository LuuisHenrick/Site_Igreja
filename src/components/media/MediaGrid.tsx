import React from 'react';
import { motion } from 'framer-motion';
import { Image, Video, FileText, Edit2, Trash2 } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';
import type { MediaFile } from '../../lib/store';

interface MediaGridProps {
  files: MediaFile[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({ files, onDelete, onEdit }) => {
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

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <motion.div
          key={file.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="group relative bg-gray-50 rounded-lg overflow-hidden"
        >
          {file.thumbnail ? (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={file.thumbnail}
                alt={file.title}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-w-16 aspect-h-9 flex items-center justify-center bg-gray-100">
              {getTypeIcon(file.type)}
            </div>
          )}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900">{file.title}</h3>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span>{formatFileSize(parseInt(file.size))}</span>
            </div>
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(file.id)}
                className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-50"
              >
                <Edit2 className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(file.id)}
                className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};