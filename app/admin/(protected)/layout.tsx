

import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!user) {
    redirect('/admin/login');
  }

  const email = user.email?.toLowerCase() ?? '';
  if (adminEmails.length > 0 && !adminEmails.includes(email)) {
    redirect('/');
  }

  return <>{children}</>;
}
