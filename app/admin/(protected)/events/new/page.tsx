
import Link from 'next/link';
import EventForm from '../EventForm';

export const dynamic = 'force-dynamic';

export default function NewEventPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin" className="admin-back">← Back to events</Link>
          <h1 className="admin-h1">New event</h1>
        </div>
      </div>
      <EventForm />
    </div>
  );
}

