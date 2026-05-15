import type { EventOccurrence, EventRow } from './supabase/types';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Expand a single weekly-recurring EventRow into concrete occurrences within a
 * window. Non-recurring events return a single occurrence (the row itself).
 */
export function expandEvent(
  row: EventRow,
  windowStart: Date,
  windowEnd: Date
): EventOccurrence[] {
  const baseStart = new Date(row.starts_at);
  const baseEnd = row.ends_at ? new Date(row.ends_at) : null;
  const duration = baseEnd ? baseEnd.getTime() - baseStart.getTime() : 0;

  if (!row.recurrence_rule || row.recurrence_rule.kind !== 'weekly') {
    const eventEnd = baseEnd ?? baseStart;
    if (eventEnd < windowStart || baseStart > windowEnd) return [];
    return [{ ...row, source_id: row.id, is_recurring_instance: false }];
  }

  const { day_of_week, until } = row.recurrence_rule;
  const untilDate = new Date(until);
  untilDate.setHours(23, 59, 59, 999);

  const occurrences: EventOccurrence[] = [];
  let cursor = new Date(baseStart);

  while (cursor.getDay() !== day_of_week) {
    cursor.setDate(cursor.getDate() + 1);
  }

  while (cursor <= untilDate && cursor <= windowEnd) {
    if (cursor >= windowStart) {
      const occStart = new Date(cursor);
      const occEnd = duration ? new Date(cursor.getTime() + duration) : null;
      occurrences.push({
        ...row,
        id: `${row.id}@${occStart.toISOString().slice(0, 10)}`,
        source_id: row.id,
        starts_at: occStart.toISOString(),
        ends_at: occEnd ? occEnd.toISOString() : null,
        is_recurring_instance: true,
      });
    }
    cursor = new Date(cursor.getTime() + 7 * DAY_MS);
  }

  return occurrences;
}
