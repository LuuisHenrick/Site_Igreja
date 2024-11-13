import { z } from 'zod';

export const assetSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description is too long'),
  category: z.string()
    .min(1, 'Category is required'),
  location: z.string()
    .min(1, 'Location is required'),
  status: z.string()
    .min(1, 'Status is required'),
  acquisitionDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  value: z.number()
    .min(0, 'Value must be positive')
    .max(1000000, 'Value is too high'),
  documents: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      size: z.number(),
      url: z.string(),
      uploadedAt: z.string(),
    })
  ).optional(),
});

export type AssetFormData = z.infer<typeof assetSchema>;