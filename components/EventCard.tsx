import Link from 'next/link';
import Image from 'next/image';
import type { EventOccurrence } from '../lib/supabase/types';
import { CATEGORY_META } from '../lib/supabase/types';
import { formatEventDateLong, formatEventTimeRange } from '../lib/format';
import './EventCard.css';

interface Props {
  event: EventOccurrence;
  variant?: 'default' | 'compact';
}

export default function EventCard({ event, variant = 'default' }: Props) {
  const cat = CATEGORY_META[event.category];
  const isPrivate = !event.is_public;

  if (isPrivate) {
    return (
      <div className={`event-card event-card--private event-card--${variant}`}>
        <span className="event-card-cat" style={{ background: cat.color }}>
          Booked
        </span>
        <p className="event-card-private-date">
          {formatEventDateLong(event.starts_at)}
        </p>
        <p className="event-card-private-msg">
          Privately booked. Inquire on Instagram for upcoming public dates.
        </p>
      </div>
    );
  }

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`event-card event-card--${variant}`}
    >
      {event.photo_url && (
        <div className="event-card-photo">
          <Image
            src={event.photo_url}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="event-card-photo-img"
          />
        </div>
      )}
      <div className="event-card-body">
        <span className="event-card-cat" style={{ background: cat.color }}>
          {cat.label}
        </span>
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-date">{formatEventDateLong(event.starts_at)}</p>
        <p className="event-card-time">
          {formatEventTimeRange(event.starts_at, event.ends_at)}
        </p>
        {event.location_name && (
          <p className="event-card-location">{event.location_name}</p>
        )}
      </div>
    </Link>
  );
}
