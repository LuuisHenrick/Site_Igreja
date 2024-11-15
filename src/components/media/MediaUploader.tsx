import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Video, Folder, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { generateId } from '../../lib/utils';
import { toast } from 'sonner';
import type { MediaFile } from '../../lib/store';

interface MediaUploaderProps {
  onUploadComplete: (files: MediaFile[]) => void;
  existingCategories?: string[];
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'image/gif': [],
};
const ACCEPTED_VIDEO_TYPES = {
  'video/mp4': [],
  'video/quicktime': [], // MOV
  'video/x-msvideo': [], // AVI
};

export const MediaUploader: React.FC<MediaUploaderProps> = ({ 
  onUploadComplete,
  existingCategories = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<Array<{ file: File; preview: string }>>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      if (errors[0]?.code === 'file-too-large') {
        toast.error(`${file.name} is too large. Max size is 50MB`);
      } else if (errors[0]?.code === 'file-invalid-type') {
        toast.error(`${file.name} has an invalid file type`);
      }
    });

    // Handle accepted files
    const newPreviewFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewFiles(prev => [...prev, ...newPreviewFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      ...ACCEPTED_IMAGE_TYPES,
      ...ACCEPTED_VIDEO_TYPES,
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true
  });

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    if (existingCategories.includes(newCategoryName)) {
      toast.error('This category already exists');
      return;
    }
    setSelectedCategory(newCategoryName);
    setIsCreatingCategory(false);
    setNewCategoryName('');
    toast.success('Category created successfully');
  };

  const handleUpload = async () => {
    if (!selectedCategory) {
      toast.error('Please select or create a category');
      return;
    }

    if (previewFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    const processedFiles: MediaFile[] = previewFiles.map(({ file, preview }) => {
      const isImage = file.type.startsWith('image/');
      return {
        id: generateId(),
        title: file.name,
        type: isImage ? 'image' : 'video',
        url: preview,
        thumbnail: isImage ? preview : undefined,
        uploadDate: new Date().toISOString(),
        size: file.size.toString(),
        category: selectedCategory
      };
    });

    onUploadComplete(processedFiles);
    setPreviewFiles([]);
    toast.success('Files uploaded successfully');
  };

  const removePreviewFile = (index: number) => {
    setPreviewFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xs">
          {isCreatingCategory ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <Button onClick={handleCreateCategory}>Create</Button>
              <Button
                variant="secondary"
                onClick={() => setIsCreatingCategory(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                {existingCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Button
                variant="secondary"
                icon={Plus}
                onClick={() => setIsCreatingCategory(true)}
              >
                New
              </Button>
            </div>
          )}
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? "Drop the files here..."
              : "Drag 'n' drop files here, or click to select"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: JPEG, PNG, GIF, MP4, MOV, AVI (Max 50MB per file)
          </p>
        </div>
      </div>

      {previewFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Selected Files</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {previewFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                    {file.file.type.startsWith('image/') ? (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removePreviewFile(index)}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="mt-1 text-xs text-gray-500 truncate">
                    {file.file.name}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={previewFiles.length === 0 || !selectedCategory}
        >
          Upload Files
        </Button>
      </div>
    </div>
  );
};