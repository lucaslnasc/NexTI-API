import { z } from 'zod';

/**
 * Schema base para interaction
 */
export const interactionSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid('ID do usuário deve ser um UUID válido'),
  ticket_id: z.string().uuid('ID do ticket deve ser um UUID válido'),
  message: z.string()
    .min(1, 'Mensagem é obrigatória')
    .max(5000, 'Mensagem não pode exceder 5000 caracteres'),
  sent_by: z.string()
    .min(1, 'Campo "sent_by" é obrigatório')
    .max(100, 'Campo "sent_by" não pode exceder 100 caracteres'),
  timestamp: z.string().datetime().optional(),
  channel: z.string()
    .max(50, 'Canal não pode exceder 50 caracteres')
    .optional(),
});

/**
 * Schema para criação de interaction
 */
export const createInteractionSchema = interactionSchema.omit({ id: true });

/**
 * Schema para atualização de interaction
 */
export const updateInteractionSchema = interactionSchema
  .omit({ id: true, user_id: true, ticket_id: true })
  .partial();

/**
 * Schema para filtros de busca de interactions
 */
export const interactionFiltersSchema = z.object({
  ticket_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  sent_by: z.string().optional(),
  channel: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
});

/**
 * Tipos derivados dos schemas
 */
export type InteractionType = z.infer<typeof interactionSchema>;
export type CreateInteractionType = z.infer<typeof createInteractionSchema>;
export type UpdateInteractionType = z.infer<typeof updateInteractionSchema>;
export type InteractionFiltersType = z.infer<typeof interactionFiltersSchema>;
