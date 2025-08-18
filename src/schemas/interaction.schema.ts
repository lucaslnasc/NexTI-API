import { z } from 'zod';

export const interactionSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  ticket_id: z.string().uuid(),
  message: z.string(),
  sent_by: z.string(),
  timestamp: z.string().datetime().optional(),
  channel: z.string().optional(),
});

export type InteractionType = z.infer<typeof interactionSchema>;
