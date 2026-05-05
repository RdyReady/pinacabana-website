export const runtime = 'edge';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/server';
import type { EventRow } from '../../../../lib/supabase/types';
import EventForm from '../EventForm';

export const dynamic = 'force-dynamic';

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-error">Failed to load event: {error.message}</div>
      </div>
    );
  }
  if (!data) notFound();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link href="/admin" className="admin-back">← Back to events</Link>
          <h1 className="admin-h1">Edit event</h1>
        </div>
      </div>
      <EventForm event={data as EventRow} />
    </div>
  );
}
