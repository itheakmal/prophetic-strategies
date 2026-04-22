'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        setError(body?.error?.message ?? 'Signup failed');
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
      <h1 className='mb-2 font-serif text-2xl font-bold text-stone-900'>Sign up</h1>
      <p className='mb-6 text-sm text-stone-600'>Create a public site account.</p>
      <form className='space-y-4' onSubmit={submit}>
        <input className='w-full rounded-lg border border-stone-300 px-3 py-2' type='text' placeholder='Name' required value={name} onChange={e => setName(e.target.value)} />
        <input className='w-full rounded-lg border border-stone-300 px-3 py-2' type='email' placeholder='Email' required value={email} onChange={e => setEmail(e.target.value)} />
        <input className='w-full rounded-lg border border-stone-300 px-3 py-2' type='password' placeholder='Password (min 8)' minLength={8} required value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className='text-sm text-rose-700'>{error}</p>}
        <button className='w-full rounded-lg bg-stone-900 py-2 text-white disabled:opacity-50' disabled={loading} type='submit'>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className='mt-4 text-sm text-stone-600'>
        Already have an account? <Link className='text-amber-700 hover:underline' href='/login'>Log in</Link>
      </p>
    </main>
  );
}
