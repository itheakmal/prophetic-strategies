import { z } from 'zod';

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(2, 'Subject must be at least 2 characters').max(180),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(4000),
  website: z.string().optional(),
});
