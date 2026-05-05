'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';
import '../admin.css';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'signing-in' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('signing-in');
    setErrorMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Piña Cabana — Admin</h1>
        <p className="admin-login-sub">Sign in with your admin email and password.</p>

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

          <label htmlFor="password" className="admin-label">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={status === 'signing-in'}
            className="btn-primary admin-login-btn"
          >
            {status === 'signing-in' ? 'Signing in…' : 'Sign in'}
          </button>

          {status === 'error' && (
            <p className="admin-login-error">{errorMsg || 'Sign-in failed. Check your credentials.'}</p>
          )}
        </form>
      </div>
    </main>
  );
}
