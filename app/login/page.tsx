'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        setError(body?.error?.message ?? 'Login failed');
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm'>
      <h1 className='mb-2 font-serif text-2xl font-bold text-stone-900'>Log in</h1>
      <p className='mb-6 text-sm text-stone-600'>Access your account to continue.</p>
      <form className='space-y-4' onSubmit={submit}>
        <input className='w-full rounded-lg border border-stone-300 px-3 py-2' type='email' placeholder='Email' required value={email} onChange={e => setEmail(e.target.value)} />
        <input className='w-full rounded-lg border border-stone-300 px-3 py-2' type='password' placeholder='Password' required value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className='text-sm text-rose-700'>{error}</p>}
        <button className='w-full rounded-lg bg-stone-900 py-2 text-white disabled:opacity-50' disabled={loading} type='submit'>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className='mt-3 text-sm text-stone-600'>
        <Link className='text-amber-700 hover:underline' href='/forgot-password'>
          Forgot password?
        </Link>
      </p>
      <p className='mt-4 text-sm text-stone-600'>
        New here? <Link className='text-amber-700 hover:underline' href='/signup'>Create account</Link>
      </p>
    </main>
  );
}
