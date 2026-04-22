import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(254),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(128),
});

export const adminCreateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  role: z.enum(['ADMIN', 'EDITOR']).default('EDITOR'),
});
