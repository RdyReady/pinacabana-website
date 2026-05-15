import type { AvailabilityBlockRow, EventOccurrence } from './supabase/types';

export function isoDay(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

export function monthLabel(d: Date): string {
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/** Returns a Sunday-padded grid of dates for the month containing `cursor`. */
export function buildMonthGrid(cursor: Date): Date[] {
  const start = startOfMonth(cursor);
  const end = endOfMonth(cursor);
  const days: Date[] = [];

  const padStart = start.getDay();
  for (let i = padStart; i > 0; i--) {
    const d = new Date(start);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  for (let i = 1; i <= end.getDate(); i++) {
    days.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
  }
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1];
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    days.push(d);
  }
  return days;
}

/** Maps each Manila-timezone day key (YYYY-MM-DD) to its occurrences. */
export function buildOccurrencesByDay(
  occurrences: EventOccurrence[]
): Record<string, EventOccurrence[]> {
  const map: Record<string, EventOccurrence[]> = {};
  for (const occ of occurrences) {
    const startDate = new Date(occ.starts_at);
    const endDate = occ.ends_at ? new Date(occ.ends_at) : startDate;
    const cur = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const last = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    while (cur <= last) {
      const key = isoDay(cur);
      if (!map[key]) map[key] = [];
      if (!map[key].some((e) => e.id === occ.id)) map[key].push(occ);
      cur.setDate(cur.getDate() + 1);
    }
  }
  return map;
}

/** Returns the set of Manila-timezone day keys covered by availability blocks. */
export function buildBlockedDays(blocks: AvailabilityBlockRow[]): Set<string> {
  const set = new Set<string>();
  for (const b of blocks) {
    const cur = new Date(b.starts_at);
    const end = new Date(b.ends_at);
    while (cur <= end) {
      set.add(isoDay(cur));
      cur.setDate(cur.getDate() + 1);
    }
  }
  return set;
}
