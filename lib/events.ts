import { createPublicClient } from './supabase/server';
import { expandEvent } from './recurrence';
import type { EventOccurrence, EventRow, AvailabilityBlockRow } from './supabase/types';

export { expandEvent } from './recurrence';

const DAY_MS = 24 * 60 * 60 * 1000;

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
