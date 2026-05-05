'use client';
import { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import '../admin.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    const supabase = createClient();
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/admin/auth/callback`
        : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }
    setStatus('sent');
  }

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Piña Cabana — Admin</h1>
        <p className="admin-login-sub">Magic-link sign-in. Only the allowlisted admin email can access the dashboard.</p>

        {status === 'sent' ? (
          <div className="admin-login-success">
            <h2>Check your email.</h2>
            <p>A sign-in link has been sent to <strong>{email}</strong>. Click it to enter the dashboard.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="admin-login-form">
            <label htmlFor="email" className="admin-label">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary admin-login-btn"
            >
              {status === 'sending' ? 'Sending…' : 'Send magic link'}
            </button>
            {status === 'error' && (
              <p className="admin-login-error">{errorMsg || 'Something went wrong. Try again.'}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
