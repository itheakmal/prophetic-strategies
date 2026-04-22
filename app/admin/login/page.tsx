'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        setError(body?.error?.message ?? 'Sign-in failed');
        return;
      }
      router.push('/admin/overview');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm'>
      <h1 className='mb-2 font-serif text-2xl font-bold text-stone-900'>Admin sign in</h1>
      <p className='mb-6 text-sm text-stone-600'>
        Use credentials from <code className='rounded bg-stone-100 px-1'>ADMIN_EMAIL</code>{' '}
        and <code className='rounded bg-stone-100 px-1'>ADMIN_PASSWORD</code> in your env.
      </p>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div>
          <label htmlFor='email' className='mb-1 block text-sm font-medium text-stone-700'>
            Email
          </label>
          <input
            id='email'
            type='email'
            autoComplete='username'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900'
            required
          />
        </div>
        <div>
          <label htmlFor='password' className='mb-1 block text-sm font-medium text-stone-700'>
            Password
          </label>
          <input
            id='password'
            type='password'
            autoComplete='current-password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900'
            required
          />
        </div>
        {error && (
          <p className='rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800' role='alert'>
            {error}
          </p>
        )}
        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-lg bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50'
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
