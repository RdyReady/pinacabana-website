'use client';
import { createBrowserClient } from '@supabase/ssr';

export class SupabaseConfigError extends Error {
  constructor(missing: string[]) {
    super(
      `Supabase client missing env: ${missing.join(', ')}. ` +
        `Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to BUILD environment in Cloudflare and redeploy.`
    );
    this.name = 'SupabaseConfigError';
  }
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const missing: string[] = [];
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!key) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (missing.length) {
    throw new SupabaseConfigError(missing);
  }
  return createBrowserClient(url!, key!);
}
