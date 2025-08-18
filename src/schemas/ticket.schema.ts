// Enum para status de ticket
export const ticketStatusEnum = z.enum([
  'open',
  'in_progress',
  'resolved',
  'closed',
  'pending',
  'escalated'
]);

// Enum para prioridade de ticket
export const ticketPriorityEnum = z.enum([
  'low',
  'normal',
  'high',
  'urgent'
]);

import { z } from 'zod';

/**
 * Schema para criação de um novo ticket
 */
export const createTicketSchema = z.object({
  user_id: z.string().uuid(),
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be at most 1000 characters'),
  status: ticketStatusEnum.optional(),
  priority: ticketPriorityEnum.optional(),
  category: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  source: z.string().optional(),
  escalation_level: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  resolved_at: z.string().datetime().optional(),
  resolution_notes: z.string().optional(),
});

/**
 * Schema para atualização de status do ticket
 */
export const updateTicketStatusSchema = z.object({
  status: ticketStatusEnum,
});

/**
 * Schema para filtros de busca de tickets
 */
export const ticketFiltersSchema = z.object({
  status: ticketStatusEnum.optional(),
  priority: ticketPriorityEnum.optional(),
  category: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
});

/**
 * Tipos derivados dos schemas
 */
export type CreateTicketType = z.infer<typeof createTicketSchema>;
export type UpdateTicketStatusType = z.infer<typeof updateTicketStatusSchema>;
export type TicketFiltersType = z.infer<typeof ticketFiltersSchema>;
