import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/Button';
import { assetSchema, type AssetFormData } from './AssetValidation';

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (data: AssetFormData) => void;
}

const categories = [
  'Equipment',
  'Furniture',
  'Digital',
  'Vehicles',
  'Musical Instruments',
  'Office Equipment',
  'Other',
];

const locations = [
  'Main Sanctuary',
  'Fellowship Hall',
  'Office',
  'Storage',
  'Youth Room',
  'Kitchen',
  'Other',
];

const statuses = [
  'Available',
  'In Use',
  'Maintenance',
  'Reserved',
  'Retired',
  'Disposed',
];

export const AssetForm: React.FC<AssetFormProps> = ({ asset, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: asset ? {
      ...asset,
    } : {
      status: 'Available',
      documents: [],
    },
  });

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const newDocuments = acceptedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));

    setValue('documents', [...watch('documents'), ...newDocuments]);
  }, [setValue, watch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
    maxSize: 5242880, // 5MB
  });

  const documents = watch('documents');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <select
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a location</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Acquisition Date</label>
          <input
            type="date"
            {...register('acquisitionDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.acquisitionDate && (
            <p className="mt-1 text-sm text-red-600">{errors.acquisitionDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Value</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register('value', { valueAsNumber: true })}
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Documents & Images</label>
        <div
          {...getRootProps()}
          className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-indigo-500 transition-colors cursor-pointer"
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
              {isDragActive
                ? "Drop the files here..."
                : "Drag 'n' drop files here, or click to select files"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: Images, PDF, Word (Max 5MB)
            </p>
          </div>
        </div>
        {errors.documents && (
          <p className="mt-1 text-sm text-red-600">{errors.documents.message}</p>
        )}
        {documents && documents.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-200">
            {documents.map((doc, index) => (
              <li key={index} className="py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-900">{doc.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({(doc.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newDocs = [...documents];
                    newDocs.splice(index, 1);
                    setValue('documents', newDocs);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {asset ? 'Update Asset' : 'Add Asset'}
        </Button>
      </div>
    </form>
  );
};