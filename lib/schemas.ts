import { z } from 'zod';
import type { RecurrenceRule } from './supabase/types';

function localToISO(v: string): string {
  return new Date(v).toISOString();
}

export const EventDraftSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  category: z.enum(['popup', 'private', 'wedding', 'brand']),
  starts_at: z.string().min(1, 'Start time is required').transform(localToISO),
  ends_at: z
    .string()
    .transform((v) => (v ? localToISO(v) : null))
    .nullable()
    .optional(),
  location_name: z
    .string()
    .trim()
    .transform((v) => v || null),
  location_url: z
    .string()
    .trim()
    .transform((v) => v || null),
  description: z
    .string()
    .trim()
    .transform((v) => v || null),
  is_public: z.boolean(),
  is_published: z.boolean(),
  recurrence_kind: z.enum(['none', 'weekly']).default('none'),
  recurrence_day_of_week: z.coerce.number().int().min(0).max(6).optional(),
  recurrence_until: z.string().optional(),
});

export type EventDraft = z.infer<typeof EventDraftSchema>;

/** Derive the RecurrenceRule from parsed draft fields. */
export function deriveRecurrenceRule(draft: EventDraft): RecurrenceRule | null {
  if (
    draft.recurrence_kind === 'weekly' &&
    draft.recurrence_day_of_week !== undefined &&
    draft.recurrence_until
  ) {
    return {
      kind: 'weekly',
      day_of_week: draft.recurrence_day_of_week,
      until: draft.recurrence_until,
    };
  }
  return null;
}
