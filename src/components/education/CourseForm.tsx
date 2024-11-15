import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Folder, File } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  instructor: z.string().min(1, 'Instructor name is required'),
  category: z.string().min(1, 'Category is required'),
  folder: z.string().optional(),
  materials: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    url: z.string(),
    uploadedAt: z.string(),
  })).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  existingFolders?: string[];
}

const categories = [
  'Bible Study',
  'Leadership',
  'Discipleship',
  'Ministry Training',
  'Worship',
  'Evangelism',
  'Other'
];

export const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, existingFolders = [] }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      materials: [],
    },
  });

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const currentMaterials = watch('materials') || [];
    const newMaterials = acceptedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    }));

    setValue('materials', [...currentMaterials, ...newMaterials]);
    toast.success(`${acceptedFiles.length} files uploaded successfully`);
  }, [setValue, watch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
    maxSize: 100 * 1024 * 1024, // 100MB max file size
  });

  const materials = watch('materials') || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Title</label>
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
          <label className="block text-sm font-medium text-gray-700">Instructor</label>
          <input
            type="text"
            {...register('instructor')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.instructor && (
            <p className="mt-1 text-sm text-red-600">{errors.instructor.message}</p>
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
          <label className="block text-sm font-medium text-gray-700">Folder</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Folder className="h-5 w-5 text-gray-400" />
              </div>
              <select
                {...register('folder')}
                className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select or create a folder</option>
                {existingFolders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="relative -ml-px rounded-r-md"
              onClick={() => {
                const folderName = prompt('Enter new folder name:');
                if (folderName && !existingFolders.includes(folderName)) {
                  setValue('folder', folderName);
                }
              }}
            >
              New
            </Button>
          </div>
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
        <label className="block text-sm font-medium text-gray-700">Course Materials</label>
        <div
          {...getRootProps()}
          className={`mt-1 border-2 border-dashed rounded-lg p-6 ${
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? "Drop the files here..."
                : "Drag 'n' drop course materials, or click to select files"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: Video, PDF, Word (Max 100MB per file)
            </p>
          </div>
        </div>

        {materials.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-200">
            {materials.map((material, index) => (
              <li key={index} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <File className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{material.name}</p>
                    <p className="text-sm text-gray-500">
                      {(material.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newMaterials = [...materials];
                    newMaterials.splice(index, 1);
                    setValue('materials', newMaterials);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
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
          Create Course
        </Button>
      </div>
    </form>
  );
};