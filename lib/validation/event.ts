import { z } from 'zod';

export const quoteSchema = z.object({
  subtitle: z.string().min(1),
  text: z.string().min(1),
  source: z.string().min(1),
  details: z.string().optional(),
});

export const mediaSchema = z.object({
  type: z.enum(['image', 'video']),
  src: z.string().url(),
  alt: z.string().optional(),
  poster: z.string().url().optional(),
});

export const followupSchema = z.object({
  prompt: z.string().min(1),
  type: z.enum(['dropdown', 'mcq']),
  choices: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1),
});

export const createEventSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  era: z.string().min(1),
  context: z.string().min(1),
  summary: z.string().min(1),
  chronologyOrder: z.number().int().optional(),
  deeper: z.array(z.string()),
  lessons: z.array(z.string()),
  parallels: z.array(z.string()),
  quotes: z.array(quoteSchema).default([]),
  media: z.array(mediaSchema).default([]),
  followups: z
    .object({
      action: followupSchema,
      reaction: followupSchema,
    })
    .optional(),
});

export const updateEventSchema = createEventSchema.partial();
