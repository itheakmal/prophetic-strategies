import { z } from 'zod';

export const saveReflectionSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Reflection cannot be empty')
    .max(5000, 'Reflection is too long'),
});
