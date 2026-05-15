import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cookie-aware Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Uses the user's auth session.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components can't set cookies — middleware handles it.
          }
        },
      },
    }
  );
}

/**
 * Service-role client for server-side admin operations that need to bypass RLS.
 * NEVER pass to the browser.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/**
 * Read-only public client for use in Server Components that don't need a user
 * session (e.g. /events listing). Throws if env vars are missing rather than
 * returning null — callers should not silently degrade on misconfiguration.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const missing: string[] = [];
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!key) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (missing.length) {
    throw new Error(
      `Supabase public client missing env: ${missing.join(', ')}. ` +
        `Add them to the Cloudflare build environment and redeploy.`
    );
  }
  return createSupabaseClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
