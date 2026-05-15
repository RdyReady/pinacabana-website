'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { EventOccurrence, AvailabilityBlockRow } from '../lib/supabase/types';
import { CATEGORY_META } from '../lib/supabase/types';
import {
  isoDay,
  monthLabel,
  buildMonthGrid,
  buildOccurrencesByDay,
  buildBlockedDays,
} from '../lib/calendar';
import EventCard from './EventCard';
import './EventsView.css';

interface Props {
  occurrences: EventOccurrence[];
  blocks: AvailabilityBlockRow[];
}

type View = 'month' | 'list';

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

  const occurrencesByDay = useMemo(() => buildOccurrencesByDay(occurrences), [occurrences]);
  const blockedDays = useMemo(() => buildBlockedDays(blocks), [blocks]);
  const monthDays = useMemo(() => buildMonthGrid(cursor), [cursor]);

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
