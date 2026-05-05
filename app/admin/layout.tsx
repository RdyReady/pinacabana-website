import Link from 'next/link';
import { createClient } from '../../lib/supabase/server';
import SignOutButton from './SignOutButton';
import './admin.css';

export const metadata = {
  title: 'Admin · Piña Cabana',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="admin-shell">
      {user && (
        <header className="admin-header">
          <div className="admin-header-inner">
            <Link href="/admin" className="admin-brand">
              Piña Cabana — Admin
            </Link>
            <nav className="admin-nav">
              <Link href="/admin">Events</Link>
              <Link href="/admin/availability">Availability</Link>
              <Link href="/" target="_blank">View site ↗</Link>
            </nav>
            <div className="admin-user">
              <span className="admin-user-email">{user.email}</span>
              <SignOutButton />
            </div>
          </div>
        </header>
      )}
      <div className="admin-content">{children}</div>
    </div>
  );
}
