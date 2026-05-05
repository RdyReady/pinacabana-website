import Link from 'next/link';
import { getUpcomingEvents } from '../lib/events';
import EventCard from './EventCard';
import { IG_HANDLE, IG_URL } from '../lib/constants';
import './UpcomingEventsStrip.css';

export default async function UpcomingEventsStrip() {
  const events = await getUpcomingEvents(3);

  return (
    <section className="upcoming-section">
      <div className="container">
        <div className="upcoming-header">
          <div>
            <span className="section-eyebrow">Calendar</span>
            <h3 className="section-heading">Where to find us next.</h3>
          </div>
          <Link href="/events" className="upcoming-view-all">
            See full calendar →
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="upcoming-empty">
            <p>
              First pop-ups are landing on the calendar soon. Follow {IG_HANDLE} to be the
              first to know.
            </p>
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Follow {IG_HANDLE}
            </a>
          </div>
        ) : (
          <div className="upcoming-grid">
            {events.map((e) => (
              <EventCard key={e.id} event={e} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
