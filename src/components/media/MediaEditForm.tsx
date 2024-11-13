import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import type { MediaFile } from '../../lib/store';

const mediaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
});

type MediaFormData = z.infer<typeof mediaSchema>;

interface MediaEditFormProps {
  file: MediaFile;
  onSave: (updatedFile: Partial<MediaFile>) => void;
  existingCategories?: string[];
}

export const MediaEditForm: React.FC<MediaEditFormProps> = ({ 
  file, 
  onSave,
  existingCategories = ['Images', 'Videos', 'Documents', 'Presentations', 'Other']
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: file.title,
      category: file.category,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category (Folder)
        </label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {existingCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};