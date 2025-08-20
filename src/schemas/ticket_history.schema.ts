import { z } from 'zod';

/**
 * Schema base para ticket history
 */
export const ticketHistorySchema = z.object({
  id: z.string().uuid().optional(),
  ticket_id: z.string().uuid('ID do ticket deve ser um UUID válido'),
  status: z.string()
    .min(1, 'Status é obrigatório')
    .max(50, 'Status não pode exceder 50 caracteres'),
  changed_by: z.string().uuid('ID do usuário deve ser um UUID válido'),
  changed_at: z.string().datetime().optional(),
  notes: z.string()
    .max(1000, 'Observações não podem exceder 1000 caracteres')
    .optional(),
});

/**
 * Schema para criação de entrada no histórico
 */
export const createTicketHistorySchema = ticketHistorySchema.omit({ id: true });

/**
 * Schema para atualização de entrada no histórico (raramente usado)
 */
export const updateTicketHistorySchema = ticketHistorySchema
  .omit({ id: true, ticket_id: true, changed_by: true })
  .partial();

/**
 * Schema para filtros de busca no histórico
 */
export const ticketHistoryFiltersSchema = z.object({
  ticket_id: z.string().uuid().optional(),
  status: z.string().optional(),
  changed_by: z.string().uuid().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
});

/**
 * Tipos derivados dos schemas
 */
export type TicketHistoryType = z.infer<typeof ticketHistorySchema>;
export type CreateTicketHistoryType = z.infer<typeof createTicketHistorySchema>;
export type UpdateTicketHistoryType = z.infer<typeof updateTicketHistorySchema>;
export type TicketHistoryFiltersType = z.infer<typeof ticketHistoryFiltersSchema>;
