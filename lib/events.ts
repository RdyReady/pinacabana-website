import { createPublicClient } from './supabase/server';
import type {
  EventOccurrence,
  EventRow,
  AvailabilityBlockRow,
} from './supabase/types';

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
    // For multi-day events, check if the event overlaps the window at all
    const eventEnd = baseEnd ?? baseStart;
    if (eventEnd < windowStart || baseStart > windowEnd) return [];
    return [
      {
        ...row,
        id: row.id,
        source_id: row.id,
        is_recurring_instance: false,
      },
    ];
  }

  const { day_of_week, until } = row.recurrence_rule;
  const untilDate = new Date(until);
  untilDate.setHours(23, 59, 59, 999);

  const occurrences: EventOccurrence[] = [];

  // Walk forward week-by-week from the base start until we exit the window or
  // pass the until-date.
  let cursor = new Date(baseStart);

  // Snap cursor's day-of-week to the recurrence's day_of_week if needed.
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

/**
 * Get all event occurrences within [start, end], including recurrence
 * expansion. Filters to published events; private events are returned but
 * the caller should hide their detail fields when rendering publicly.
 */
export async function getEventsInRange(
  start: Date,
  end: Date
): Promise<EventOccurrence[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true);

  if (error) {
    console.error('getEventsInRange error', error);
    return [];
  }

  const rows = (data ?? []) as EventRow[];
  const occurrences = rows.flatMap((row) => expandEvent(row, start, end));
  occurrences.sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  );
  return occurrences;
}

/**
 * Get the next N upcoming public, published occurrences, starting from now.
 */
export async function getUpcomingEvents(limit = 3): Promise<EventOccurrence[]> {
  const now = new Date();
  const horizon = new Date(now.getTime() + 365 * DAY_MS);
  const all = await getEventsInRange(now, horizon);
  return all.filter((e) => e.is_public).slice(0, limit);
}

/**
 * Get a single event by slug (no recurrence expansion — detail page shows the
 * recurrence pattern in human form).
 */
export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('getEventBySlug error', error);
    return null;
  }
  return data as EventRow | null;
}

/**
 * Get availability blocks within a window. Used to render "unavailable" days
 * on the calendar. Reasons are NOT exposed publicly.
 */
export async function getAvailabilityBlocks(
  start: Date,
  end: Date
): Promise<AvailabilityBlockRow[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('availability_blocks')
    .select('*')
    .gte('ends_at', start.toISOString())
    .lte('starts_at', end.toISOString());

  if (error) {
    console.error('getAvailabilityBlocks error', error);
    return [];
  }
  return (data ?? []) as AvailabilityBlockRow[];
}

// Re-export formatters from the framework-agnostic module so existing imports
// from './lib/events' keep working on the server side.
export { formatDate, formatEventDateLong, formatEventTimeRange } from './format';
