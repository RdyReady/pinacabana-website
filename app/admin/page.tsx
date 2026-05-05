import Link from 'next/link';
import { createClient } from '../../lib/supabase/server';
import type { EventRow } from '../../lib/supabase/types';
import { CATEGORY_META } from '../../lib/supabase/types';
import { formatEventDateLong } from '../../lib/events';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('starts_at', { ascending: true });

  const events = (data ?? []) as EventRow[];
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.starts_at).getTime() >= now);
  const past = events.filter((e) => new Date(e.starts_at).getTime() < now);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-h1">Events</h1>
          <p className="admin-sub">
            Create, edit, and publish events. Drafts are not visible on the public site.
          </p>
        </div>
        <Link href="/admin/events/new" className="btn-primary admin-cta">
          + New event
        </Link>
      </div>

      {error && (
        <div className="admin-error">
          Failed to load events: {error.message}. Have you run the SQL migration?
        </div>
      )}

      <section className="admin-section">
        <h2 className="admin-h2">Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <p className="admin-empty">No upcoming events. Create one to get started.</p>
        ) : (
          <ul className="admin-event-list">
            {upcoming.map((e) => (
              <EventListItem key={e.id} event={e} />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section className="admin-section">
          <h2 className="admin-h2">Past ({past.length})</h2>
          <ul className="admin-event-list">
            {past.map((e) => (
              <EventListItem key={e.id} event={e} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function EventListItem({ event }: { event: EventRow }) {
  const cat = CATEGORY_META[event.category];
  return (
    <li className="admin-event-item">
      <span
        className="admin-event-cat-dot"
        style={{ background: cat.color }}
        aria-hidden="true"
      />
      <div className="admin-event-main">
        <Link href={`/admin/events/${event.id}`} className="admin-event-title">
          {event.title}
        </Link>
        <div className="admin-event-meta">
          <span>{formatEventDateLong(event.starts_at)}</span>
          <span>·</span>
          <span>{cat.label}</span>
          {!event.is_public && <span className="admin-tag admin-tag-private">Private</span>}
          {!event.is_published && <span className="admin-tag admin-tag-draft">Draft</span>}
          {event.recurrence_rule && (
            <span className="admin-tag admin-tag-recurring">Weekly</span>
          )}
        </div>
      </div>
    </li>
  );
}
