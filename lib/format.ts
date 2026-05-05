/** Format an ISO date for the Asia/Manila timezone. */
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    ...opts,
  }).format(new Date(iso));
}

export function formatEventDateLong(iso: string) {
  return formatDate(iso, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatEventTimeRange(startIso: string, endIso: string | null) {
  const start = formatDate(startIso, { hour: 'numeric', minute: '2-digit' });
  if (!endIso) return start;
  const end = formatDate(endIso, { hour: 'numeric', minute: '2-digit' });
  return `${start} – ${end}`;
}
