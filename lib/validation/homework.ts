import { z } from 'zod';

export const homeworkCommentBodySchema = z.object({
  body: z.string().trim().min(1).max(4000),
});

export const homeworkCreateFieldsSchema = z.object({
  title: z.string().trim().min(1).max(240),
  session: z.string().trim().min(1).max(240),
  thoughts: z.string().trim().min(1).max(12000),
});

export const HOMEWORK_ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
]);

export const HOMEWORK_MAX_FILE_BYTES = 5 * 1024 * 1024;
export const HOMEWORK_MAX_TOTAL_BYTES = 25 * 1024 * 1024;
export const HOMEWORK_MAX_FILES = 10;
