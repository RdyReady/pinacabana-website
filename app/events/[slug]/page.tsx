
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEventBySlug, formatEventDateLong, formatEventTimeRange } from '../../../lib/events';
import { CATEGORY_META } from '../../../lib/supabase/types';
import { IG_HANDLE, IG_URL } from '../../../lib/constants';
import '../events.css';

export const dynamic = 'force-dynamic';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event · Piña Cabana' };
  return {
    title: `${event.title} · Piña Cabana`,
    description: event.description ?? `${event.title} — ${event.location_name ?? 'Boracay'}.`,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  // Private events: don't reveal title/details on the public detail page either.
  if (!event.is_public) {
    return (
      <main id="top" className="event-detail">
        <div className="container event-detail-inner">
          <Link href="/events" className="event-detail-back">← Back to calendar</Link>
          <h1 className="event-detail-title">Privately booked</h1>
          <p className="event-detail-description">
            This date is privately booked. We&apos;ll be back on the public calendar soon —
            follow {IG_HANDLE} for upcoming pop-ups.
          </p>
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Follow {IG_HANDLE}
          </a>
        </div>
      </main>
    );
  }

  const cat = CATEGORY_META[event.category];

  return (
    <main id="top" className="event-detail">
      <div className="container event-detail-inner">
        <Link href="/events" className="event-detail-back">← Back to calendar</Link>

        <span className="event-detail-cat" style={{ background: cat.color }}>
          {cat.label}
        </span>

        <h1 className="event-detail-title">{event.title}</h1>

        {event.recurrence_rule?.kind === 'weekly' && (
          <div className="event-detail-recurrence">
            Repeats every {dayNames[event.recurrence_rule.day_of_week]} until{' '}
            {new Date(event.recurrence_rule.until).toLocaleDateString('en-PH', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
            .
          </div>
        )}

        <div className="event-detail-meta">
          <div className="event-detail-meta-row">
            <span className="event-detail-meta-label">When</span>
            <span>{formatEventDateLong(event.starts_at)}</span>
          </div>
          <div className="event-detail-meta-row">
            <span className="event-detail-meta-label">Time</span>
            <span>{formatEventTimeRange(event.starts_at, event.ends_at)}</span>
          </div>
          {event.location_name && (
            <div className="event-detail-meta-row">
              <span className="event-detail-meta-label">Where</span>
              <span>{event.location_name}</span>
            </div>
          )}
        </div>

        {event.photo_url && (
          <div className="event-detail-photo">
            <a
              href={event.photo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="event-detail-photo-link"
            >
              <Image
                src={event.photo_url}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, 880px"
                priority
              />
            </a>
          </div>
        )}

        {event.description && (
          <p className="event-detail-description">{event.description}</p>
        )}

        {event.location_url && (
          <a
            href={event.location_url}
            target="_blank"
            rel="noopener noreferrer"
            className="event-detail-location-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Open in Google Maps →
          </a>
        )}

        <section className="event-detail-cta-section">
          <h3>Want to book us for your event?</h3>
          <p>Inquiries and bookings happen via Instagram DM.</p>
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Follow {IG_HANDLE}
          </a>
        </section>
      </div>
    </main>
  );
}
