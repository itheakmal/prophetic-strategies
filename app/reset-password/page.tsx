'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        setError(body?.error?.message ?? 'Reset failed');
        return;
      }
      setMessage('Password updated. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch {
      setError('Network error');
    }
  }

  return (
    <main className='mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm'>
      <h1 className='mb-2 font-serif text-2xl font-bold text-stone-900'>Reset password</h1>
      <p className='mb-6 text-sm text-stone-600'>Set a new password for your account.</p>
      <form className='space-y-4' onSubmit={submit}>
        <input className='w-full rounded-lg border border-stone-300 px-3 py-2' type='password' minLength={8} placeholder='New password' required value={password} onChange={e => setPassword(e.target.value)} />
        <button className='w-full rounded-lg bg-stone-900 py-2 text-white' type='submit'>Reset password</button>
      </form>
      {message && <p className='mt-4 text-sm text-emerald-700'>{message}</p>}
      {error && <p className='mt-4 text-sm text-rose-700'>{error}</p>}
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className='mx-auto max-w-md p-8 text-sm text-stone-600'>Loading…</main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
