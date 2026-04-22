'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        setError(body?.error?.message ?? 'Request failed');
        return;
      }
      setMessage(`Reset request submitted. ${body.data.resetPath ? `Use: ${body.data.resetPath}` : ''}`);
    } catch {
      setError('Network error');
    }
  }

  return (
    <main className='mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm'>
      <h1 className='mb-2 font-serif text-2xl font-bold text-stone-900'>Forgot password</h1>
      <p className='mb-6 text-sm text-stone-600'>Enter your account email to request a reset link.</p>
      <form className='space-y-4' onSubmit={submit}>
        <input className='w-full rounded-lg border border-stone-300 px-3 py-2' type='email' placeholder='Email' required value={email} onChange={e => setEmail(e.target.value)} />
        <button className='w-full rounded-lg bg-stone-900 py-2 text-white' type='submit'>Request reset</button>
      </form>
      {message && <p className='mt-4 text-sm text-emerald-700'>{message}</p>}
      {error && <p className='mt-4 text-sm text-rose-700'>{error}</p>}
    </main>
  );
}
