
import Link from 'next/link';
import EventsView from '../../components/EventsView';
import { getAvailabilityBlocks, getEventsInRange } from '../../lib/events';
import { IG_HANDLE, IG_URL } from '../../lib/constants';
import './events.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Calendar · Piña Cabana',
  description:
    'Upcoming pop-ups, weddings, and brand events with Piña Cabana — Boracay\'s mobile cocktail bar.',
};

export default async function EventsPage() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 12, 0);
  const [occurrences, blocks] = await Promise.all([
    getEventsInRange(start, end),
    getAvailabilityBlocks(start, end),
  ]);

  return (
    <main id="top" className="events-page">
      <div className="container events-page-inner">
        <header className="events-page-header">
          <Link href="/" className="events-back">← Home</Link>
          <span className="section-eyebrow">Calendar</span>
          <h1 className="events-page-title">
            Where to find us next.
          </h1>
          <p className="events-page-sub">
            Upcoming pop-ups, weddings, and brand events. Want to book us for your date?
            DM us on Instagram.
          </p>
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="btn-primary events-page-cta">
            Inquire on {IG_HANDLE}
          </a>
        </header>

        {occurrences.length === 0 && blocks.length === 0 ? (
          <div className="events-empty">
            <h2>Calendar going live with our first pop-ups soon.</h2>
            <p>Follow {IG_HANDLE} to be the first to know when we book a date.</p>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Follow {IG_HANDLE}
            </a>
          </div>
        ) : (
          <EventsView occurrences={occurrences} blocks={blocks} />
        )}
      </div>
    </main>
  );
}

