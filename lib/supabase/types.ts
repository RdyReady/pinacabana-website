export type EventCategory = 'popup' | 'private' | 'wedding' | 'brand';

export interface RecurrenceRule {
  kind: 'weekly';
  /** 0 = Sunday … 6 = Saturday (matches JS Date.getDay) */
  day_of_week: number;
  /** ISO date string, inclusive end */
  until: string;
}

export interface EventRow {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  starts_at: string;
  ends_at: string | null;
  location_name: string | null;
  location_url: string | null;
  description: string | null;
  photo_url: string | null;
  is_public: boolean;
  is_published: boolean;
  recurrence_rule: RecurrenceRule | null;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityBlockRow {
  id: string;
  starts_at: string;
  ends_at: string;
  reason_internal: string | null;
  created_at: string;
}

/**
 * A specific occurrence after recurrence expansion. Same fields as EventRow
 * but `starts_at` / `ends_at` reflect this instance, and `id` includes a
 * stable suffix so React keys don't collide.
 */
export interface EventOccurrence extends Omit<EventRow, 'id'> {
  id: string;
  /** Original DB row id, useful for admin links */
  source_id: string;
  /** True when this occurrence comes from a recurrence rule */
  is_recurring_instance: boolean;
}

export const CATEGORY_META: Record<
  EventCategory,
  { label: string; color: string; description: string }
> = {
  popup: {
    label: 'Pop-up',
    color: '#F2C94C',
    description: 'Public, walk-up welcome',
  },
  private: {
    label: 'Private',
    color: '#5b6470',
    description: 'Privately booked',
  },
  wedding: {
    label: 'Wedding',
    color: '#F2994A',
    description: 'Wedding service',
  },
  brand: {
    label: 'Brand',
    color: '#6A803B',
    description: 'Brand activation',
  },
};
