
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/admin';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
    console.error('exchangeCodeForSession error', error);
  }

  // Anything wrong → back to login with a flag.
  const failed = new URL('/admin/login?error=callback', url.origin);
  return NextResponse.redirect(failed);
}

