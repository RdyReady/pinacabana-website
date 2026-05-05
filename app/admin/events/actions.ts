'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import type { EventCategory, RecurrenceRule } from '../../../lib/supabase/types';

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

interface ParsedForm {
  slug: string;
  title: string;
  category: EventCategory;
  starts_at: string;
  ends_at: string | null;
  location_name: string | null;
  location_url: string | null;
  description: string | null;
  is_public: boolean;
  is_published: boolean;
  recurrence_rule: RecurrenceRule | null;
}

function parseForm(formData: FormData): ParsedForm {
  const title = String(formData.get('title') ?? '').trim();
  const slugRaw = String(formData.get('slug') ?? '').trim();
  const slug = slugify(slugRaw || title) || `event-${Date.now()}`;
  const category = String(formData.get('category') ?? 'popup') as EventCategory;
  const starts_at = String(formData.get('starts_at') ?? '');
  const ends_atRaw = String(formData.get('ends_at') ?? '');
  const ends_at = ends_atRaw ? ends_atRaw : null;
  const location_name = (formData.get('location_name')?.toString() || '').trim() || null;
  const location_url = (formData.get('location_url')?.toString() || '').trim() || null;
  const description = (formData.get('description')?.toString() || '').trim() || null;
  const is_public = formData.get('is_public') === 'on';
  const is_published = formData.get('is_published') === 'on';

  const recurrenceKind = String(formData.get('recurrence_kind') ?? 'none');
  let recurrence_rule: RecurrenceRule | null = null;
  if (recurrenceKind === 'weekly') {
    const day_of_week = Number(formData.get('recurrence_day_of_week') ?? -1);
    const until = String(formData.get('recurrence_until') ?? '');
    if (day_of_week >= 0 && day_of_week <= 6 && until) {
      recurrence_rule = { kind: 'weekly', day_of_week, until };
    }
  }

  return {
    slug,
    title,
    category,
    starts_at: new Date(starts_at).toISOString(),
    ends_at: ends_at ? new Date(ends_at).toISOString() : null,
    location_name,
    location_url,
    description,
    is_public,
    is_published,
    recurrence_rule,
  };
}

async function uploadPhoto(
  formData: FormData,
  slug: string
): Promise<string | null> {
  const file = formData.get('photo') as File | null;
  if (!file || typeof file === 'string' || file.size === 0) return null;

  const supabase = await createClient();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('event-photos')
    .upload(path, file, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });
  if (error) {
    console.error('photo upload error', error);
    return null;
  }
  const { data } = supabase.storage.from('event-photos').getPublicUrl(path);
  return data.publicUrl ?? null;
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const parsed = parseForm(formData);
  const photo_url = await uploadPhoto(formData, parsed.slug);

  const { error } = await supabase.from('events').insert({
    ...parsed,
    photo_url,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/events');
  revalidatePath('/');
  redirect('/admin');
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createClient();
  const parsed = parseForm(formData);
  const newPhoto = await uploadPhoto(formData, parsed.slug);

  const update: Record<string, unknown> = { ...parsed };
  if (newPhoto) update.photo_url = newPhoto;

  const { error } = await supabase
    .from('events')
    .update(update)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/events/${id}`);
  revalidatePath('/events');
  revalidatePath(`/events/${parsed.slug}`);
  revalidatePath('/');
  redirect('/admin');
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/events');
  revalidatePath('/');
  redirect('/admin');
}

export async function createAvailabilityBlock(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const starts_at = new Date(String(formData.get('starts_at') ?? '')).toISOString();
  const ends_at = new Date(String(formData.get('ends_at') ?? '')).toISOString();
  const reason_internal =
    (formData.get('reason_internal')?.toString() || '').trim() || null;

  const { error } = await supabase
    .from('availability_blocks')
    .insert({ starts_at, ends_at, reason_internal });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/availability');
  revalidatePath('/events');
}

export async function deleteAvailabilityBlock(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('availability_blocks')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/availability');
  revalidatePath('/events');
}
