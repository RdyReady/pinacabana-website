import { createClient } from '../../../lib/supabase/server';
import type { AvailabilityBlockRow } from '../../../lib/supabase/types';
import {
  createAvailabilityBlock,
  deleteAvailabilityBlock,
} from '../events/actions';
import { formatEventDateLong } from '../../../lib/events';

export const dynamic = 'force-dynamic';

export default async function AvailabilityPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('availability_blocks')
    .select('*')
    .order('starts_at', { ascending: true });

  const blocks = (data ?? []) as AvailabilityBlockRow[];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-h1">Availability</h1>
          <p className="admin-sub">
            Block off days that aren&apos;t public events (personal time, private bookings
            you can&apos;t announce). The public calendar shows them as &quot;Unavailable.&quot;
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          Failed to load availability: {error.message}. Have you run the SQL migration?
        </div>
      )}

      <section className="admin-section">
        <h2 className="admin-h2">Add unavailable block</h2>
        <form action={createAvailabilityBlock} className="admin-form">
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="starts_at">Starts</label>
              <input
                id="starts_at"
                name="starts_at"
                type="datetime-local"
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="ends_at">Ends</label>
              <input id="ends_at" name="ends_at" type="datetime-local" required />
            </div>
            <div className="admin-field admin-field-wide">
              <label htmlFor="reason_internal">Internal note (private)</label>
              <input
                id="reason_internal"
                name="reason_internal"
                placeholder="e.g. holiday, private booking, vacation"
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn-primary">
              Add block
            </button>
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h2 className="admin-h2">Existing blocks ({blocks.length})</h2>
        {blocks.length === 0 ? (
          <p className="admin-empty">No availability blocks.</p>
        ) : (
          <ul className="admin-event-list">
            {blocks.map((b) => (
              <li key={b.id} className="admin-event-item">
                <div className="admin-event-main">
                  <div className="admin-event-title">
                    {formatEventDateLong(b.starts_at)}
                    {b.starts_at.slice(0, 10) !== b.ends_at.slice(0, 10) &&
                      ` – ${formatEventDateLong(b.ends_at)}`}
                  </div>
                  <div className="admin-event-meta">
                    {b.reason_internal && <span>{b.reason_internal}</span>}
                  </div>
                </div>
                <form
                  action={async () => {
                    'use server';
                    await deleteAvailabilityBlock(b.id);
                  }}
                >
                  <button type="submit" className="admin-delete-mini" aria-label="Delete">
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
