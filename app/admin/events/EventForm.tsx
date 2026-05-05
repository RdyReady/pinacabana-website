'use client';
import { useState, useTransition } from 'react';
import type { EventRow, EventCategory } from '../../../lib/supabase/types';
import { createEvent, deleteEvent, updateEvent } from './actions';

interface Props {
  event?: EventRow;
}

const categories: { value: EventCategory; label: string }[] = [
  { value: 'popup', label: 'Pop-up' },
  { value: 'private', label: 'Private' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'brand', label: 'Brand activation' },
];

const days = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}

export default function EventForm({ event }: Props) {
  const isEdit = !!event;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [recurrenceKind, setRecurrenceKind] = useState<'none' | 'weekly'>(
    event?.recurrence_rule ? 'weekly' : 'none'
  );

  async function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateEvent(event!.id, formData)
        : await createEvent(formData);
      if (result?.error) setError(result.error);
    });
  }

  async function onDelete() {
    if (!event) return;
    if (!confirm('Delete this event? This cannot be undone.')) return;
    startTransition(async () => {
      const result = await deleteEvent(event.id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={onSubmit} className="admin-form">
      <div className="admin-form-grid">
        <div className="admin-field admin-field-wide">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            required
            defaultValue={event?.title ?? ''}
            placeholder="Diniwid Sunset Pop-up"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="slug">URL slug</label>
          <input
            id="slug"
            name="slug"
            defaultValue={event?.slug ?? ''}
            placeholder="auto from title if blank"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            defaultValue={event?.category ?? 'popup'}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="starts_at">Starts</label>
          <input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            required
            defaultValue={toLocalInput(event?.starts_at)}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="ends_at">Ends (optional)</label>
          <input
            id="ends_at"
            name="ends_at"
            type="datetime-local"
            defaultValue={toLocalInput(event?.ends_at)}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="location_name">Location name</label>
          <input
            id="location_name"
            name="location_name"
            defaultValue={event?.location_name ?? ''}
            placeholder="Diniwid Beach, Boracay"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="location_url">Google Maps URL</label>
          <input
            id="location_url"
            name="location_url"
            type="url"
            defaultValue={event?.location_url ?? ''}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="admin-field admin-field-wide">
          <label htmlFor="description">Description (markdown ok)</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={event?.description ?? ''}
            placeholder="A sunset pop-up at Diniwid. Three signature cocktails, live DJ, walk-ups welcome."
          />
        </div>

        <div className="admin-field admin-field-wide">
          <label htmlFor="photo">Cover photo {event?.photo_url && '(replaces existing)'}</label>
          <input id="photo" name="photo" type="file" accept="image/*" />
          {event?.photo_url && (
            <p className="admin-help">
              Current:{' '}
              <a href={event.photo_url} target="_blank" rel="noopener noreferrer">
                {event.photo_url.split('/').pop()}
              </a>
            </p>
          )}
        </div>

        <fieldset className="admin-field admin-field-wide admin-fieldset">
          <legend>Recurrence</legend>
          <div className="admin-radio-row">
            <label>
              <input
                type="radio"
                name="recurrence_kind"
                value="none"
                checked={recurrenceKind === 'none'}
                onChange={() => setRecurrenceKind('none')}
              />
              <span>One-time event</span>
            </label>
            <label>
              <input
                type="radio"
                name="recurrence_kind"
                value="weekly"
                checked={recurrenceKind === 'weekly'}
                onChange={() => setRecurrenceKind('weekly')}
              />
              <span>Weekly</span>
            </label>
          </div>

          {recurrenceKind === 'weekly' && (
            <div className="admin-recurrence-grid">
              <div className="admin-field">
                <label htmlFor="recurrence_day_of_week">Day of week</label>
                <select
                  id="recurrence_day_of_week"
                  name="recurrence_day_of_week"
                  defaultValue={event?.recurrence_rule?.day_of_week ?? 5}
                >
                  {days.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="recurrence_until">Repeat until</label>
                <input
                  id="recurrence_until"
                  name="recurrence_until"
                  type="date"
                  defaultValue={event?.recurrence_rule?.until ?? ''}
                />
              </div>
            </div>
          )}
        </fieldset>

        <div className="admin-field admin-checkbox-row admin-field-wide">
          <label>
            <input
              type="checkbox"
              name="is_public"
              defaultChecked={event ? event.is_public : true}
            />
            <span>Public — show full details on the site</span>
          </label>
          <label>
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={event ? event.is_published : true}
            />
            <span>Published — visible on the public calendar</span>
          </label>
          <p className="admin-help">
            Unchecked &quot;Public&quot; shows the day as &quot;Booked&quot; with no details.
            Unchecked &quot;Published&quot; hides the event entirely (draft).
          </p>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-form-actions">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Create event'}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            className="admin-delete"
          >
            Delete event
          </button>
        )}
      </div>
    </form>
  );
}
