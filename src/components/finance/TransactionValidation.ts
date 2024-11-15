import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'Transaction type is required',
  }),
  amount: z.number()
    .positive('Amount must be greater than 0')
    .min(0.01, 'Minimum amount is $0.01')
    .max(1000000, 'Maximum amount is $1,000,000'),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category name is too long'),
  description: z.string()
    .min(3, 'Description must be at least 3 characters')
    .max(200, 'Description is too long'),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const categories = {
  income: [
    'Tithes',
    'Offerings',
    'Donations',
    'Events',
    'Missions',
    'Building Fund',
    'Other Income',
  ],
  expense: [
    'Utilities',
    'Maintenance',
    'Salaries',
    'Ministry',
    'Events',
    'Missions',
    'Office Supplies',
    'Equipment',
    'Insurance',
    'Other Expenses',
  ],
} as const;