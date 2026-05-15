'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/server';
import { EventDraftSchema, deriveRecurrenceRule } from '../../../../lib/schemas';

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

function parseForm(formData: FormData) {
  const raw = {
    title: formData.get('title'),
    category: formData.get('category'),
    starts_at: formData.get('starts_at'),
    ends_at: formData.get('ends_at') || '',
    location_name: formData.get('location_name') || '',
    location_url: formData.get('location_url') || '',
    description: formData.get('description') || '',
    is_public: formData.get('is_public') === 'on',
    is_published: formData.get('is_published') === 'on',
    recurrence_kind: formData.get('recurrence_kind') || 'none',
    recurrence_day_of_week: formData.get('recurrence_day_of_week'),
    recurrence_until: formData.get('recurrence_until') || undefined,
  };

  const draft = EventDraftSchema.parse(raw);
  const slugRaw = String(formData.get('slug') ?? '').trim();
  const slug = slugify(slugRaw || draft.title) || `event-${Date.now()}`;
  const recurrence_rule = deriveRecurrenceRule(draft);

  return {
    slug,
    title: draft.title,
    category: draft.category,
    starts_at: draft.starts_at,
    ends_at: draft.ends_at ?? null,
    location_name: draft.location_name,
    location_url: draft.location_url,
    description: draft.description,
    is_public: draft.is_public,
    is_published: draft.is_published,
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
  let parsed;
  try {
    parsed = parseForm(formData);
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Invalid form data' };
  }

  const supabase = await createClient();
  const photo_url = await uploadPhoto(formData, parsed.slug);

  const { error } = await supabase.from('events').insert({ ...parsed, photo_url });
  if (error) return { error: error.message };

  revalidatePath('/admin');
  revalidatePath('/events');
  revalidatePath('/');
  redirect('/admin');
}

export async function updateEvent(id: string, formData: FormData) {
  let parsed;
  try {
    parsed = parseForm(formData);
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Invalid form data' };
  }

  const supabase = await createClient();
  const newPhoto = await uploadPhoto(formData, parsed.slug);

  const update: Record<string, unknown> = { ...parsed };
  if (newPhoto) update.photo_url = newPhoto;

  const { error } = await supabase.from('events').update(update).eq('id', id);
  if (error) return { error: error.message };

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
