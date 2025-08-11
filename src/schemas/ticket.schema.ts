import { z } from 'zod';

/**
 * Schema para criação de um novo ticket
 */
export const createTicketSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be at most 1000 characters'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().default('normal'),
});

/**
 * Schema para atualização de status do ticket
 */
export const updateTicketStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
});

/**
 * Schema para filtros de busca de tickets
 */
export const ticketFiltersSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  userId: z.string().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
});

/**
 * Tipos derivados dos schemas
 */
export type CreateTicketType = z.infer<typeof createTicketSchema>;
export type UpdateTicketStatusType = z.infer<typeof updateTicketStatusSchema>;
export type TicketFiltersType = z.infer<typeof ticketFiltersSchema>;
