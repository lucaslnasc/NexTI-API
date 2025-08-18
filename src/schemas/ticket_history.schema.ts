import { z } from 'zod';

export const ticketHistorySchema = z.object({
  id: z.string().uuid().optional(),
  ticket_id: z.string().uuid(),
  status: z.string(),
  changed_by: z.string().uuid(),
  changed_at: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export type TicketHistoryType = z.infer<typeof ticketHistorySchema>;
