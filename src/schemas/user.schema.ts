import { z } from 'zod';

/**
 * Schema para criação de usuário
 */
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Email must be valid'),
  phone: z.string().optional(),
});

/**
 * Schema para atualização de usuário
 */
export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').optional(),
  email: z.string().email('Email must be valid').optional(),
  phone: z.string().optional(),
});

/**
 * Tipos derivados dos schemas
 */
export type CreateUserType = z.infer<typeof createUserSchema>;
export type UpdateUserType = z.infer<typeof updateUserSchema>;
