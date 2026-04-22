import { z } from 'zod';

export const tribeRefSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const createTribeSchema = z.object({
  externalId: z.string().min(1),
  name: z.string().min(1),
  group: z.string().min(1),
  phase: z.string().default('meccan'),
  x: z.number(),
  y: z.number(),
  lat: z.number(),
  lon: z.number(),
  elders: z.array(z.string()).optional(),
  chiefs: z.array(z.string()).optional(),
  refs: z.array(tribeRefSchema).optional(),
});

export const updateTribeSchema = createTribeSchema.partial();
