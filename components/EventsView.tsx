'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type {
  EventOccurrence,
  AvailabilityBlockRow,
} from '../lib/supabase/types';
import { CATEGORY_META } from '../lib/supabase/types';
import EventCard from './EventCard';
import './EventsView.css';

interface Props {
  occurrences: EventOccurrence[];
  blocks: AvailabilityBlockRow[];
}

type View = 'month' | 'list';

function isoDay(d: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function monthLabel(d: Date) {
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export default function EventsView({ occurrences, blocks }: Props) {
  const [view, setView] = useState<View>('month');
  const [cursor, setCursor] = useState<Date>(() => new Date());

  // Default view by viewport: list on mobile, month on desktop.
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const apply = () => setView(mql.matches ? 'list' : 'month');
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  const occurrencesByDay = useMemo(() => {
    const map: Record<string, EventOccurrence[]> = {};
    for (const occ of occurrences) {
      const key = isoDay(new Date(occ.starts_at));
      if (!map[key]) map[key] = [];
      map[key].push(occ);
    }
    return map;
  }, [occurrences]);

  const blockedDays = useMemo(() => {
    const set = new Set<string>();
    for (const b of blocks) {
      const start = new Date(b.starts_at);
      const end = new Date(b.ends_at);
      const cur = new Date(start);
      while (cur <= end) {
        set.add(isoDay(cur));
        cur.setDate(cur.getDate() + 1);
      }
    }
    return set;
  }, [blocks]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    const days: Date[] = [];
    // Pad to start on Sunday
    const padStart = start.getDay();
    for (let i = padStart; i > 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    for (let i = 1; i <= end.getDate(); i++) {
      days.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
    }
    // Pad to end on Saturday
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1];
      const d = new Date(last);
      d.setDate(d.getDate() + 1);
      days.push(d);
    }
    return days;
  }, [cursor]);

  const today = isoDay(new Date());

  return (
    <div className="events-view">
      <div className="events-view-toolbar">
        <div className="events-view-toggle" role="tablist">
          <button
            role="tab"
            aria-selected={view === 'month'}
            onClick={() => setView('month')}
            className={view === 'month' ? 'is-active' : ''}
          >
            Month
          </button>
          <button
            role="tab"
            aria-selected={view === 'list'}
            onClick={() => setView('list')}
            className={view === 'list' ? 'is-active' : ''}
          >
            List
          </button>
        </div>

        {view === 'month' && (
          <div className="events-month-nav">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              aria-label="Previous month"
            >
              ←
            </button>
            <span className="events-month-label">{monthLabel(cursor)}</span>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              aria-label="Next month"
            >
              →
            </button>
            <button onClick={() => setCursor(new Date())} className="events-today-btn">
              Today
            </button>
          </div>
        )}

        <div className="events-legend">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <span key={key} className="events-legend-item">
              <span className="events-legend-dot" style={{ background: meta.color }} />
              {meta.label}
            </span>
          ))}
        </div>
      </div>

      {view === 'month' ? (
        <div className="events-month">
          <div className="events-month-grid events-month-head">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="events-month-head-cell">{d}</div>
            ))}
          </div>
          <div className="events-month-grid">
            {monthDays.map((d) => {
              const key = isoDay(d);
              const isCurMonth = d.getMonth() === cursor.getMonth();
              const isToday = key === today;
              const dayEvents = occurrencesByDay[key] ?? [];
              const isBlocked = blockedDays.has(key) && dayEvents.length === 0;
              return (
                <div
                  key={`${key}-${d.getMonth()}`}
                  className={[
                    'events-month-cell',
                    !isCurMonth && 'is-out',
                    isToday && 'is-today',
                    isBlocked && 'is-blocked',
                  ].filter(Boolean).join(' ')}
                >
                  <span className="events-month-cell-num">{d.getDate()}</span>
                  {isBlocked && (
                    <span className="events-month-cell-tag">Booked</span>
                  )}
                  <div className="events-month-cell-events">
                    {dayEvents.map((occ) => {
                      const cat = CATEGORY_META[occ.category];
                      const isPrivate = !occ.is_public;
                      const inner = (
                        <span
                          className="events-month-event"
                          style={{ background: cat.color }}
                        >
                          {isPrivate ? 'Booked' : occ.title}
                        </span>
                      );
                      if (isPrivate) return <div key={occ.id}>{inner}</div>;
                      return (
                        <Link
                          key={occ.id}
                          href={`/events/${occ.slug}`}
                          className="events-month-event-link"
                        >
                          {inner}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="events-list">
          {occurrences.length === 0 ? (
            <p className="events-list-empty">
              Nothing on the calendar yet. Check back soon.
            </p>
          ) : (
            <div className="events-list-grid">
              {occurrences.map((occ) => (
                <EventCard key={occ.id} event={occ} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
