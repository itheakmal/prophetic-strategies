import { z } from 'zod';

export const contactSubmissionSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  subject: z.string().min(3).max(180),
  message: z.string().min(10).max(4000),
  website: z.string().optional(),
});
