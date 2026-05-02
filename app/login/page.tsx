'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useMemo, useState } from 'react';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { sanitizeReturnToPath } from '@/lib/nav/sanitize-return-path';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const returnTo = useMemo(
    () => sanitizeReturnToPath(searchParams.get('returnTo')),
    [searchParams]
  );
  const oauthError = searchParams.get('error');

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
      router.push(returnTo as Route);
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
        <input
          className='w-full rounded-lg border border-stone-300 px-3 py-2'
          type='email'
          placeholder='Email'
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className='w-full rounded-lg border border-stone-300 px-3 py-2'
          type='password'
          placeholder='Password'
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {(error || oauthError) && (
          <p className='text-sm text-rose-700'>{error ?? oauthError}</p>
        )}
        <button
          className='w-full rounded-lg bg-stone-900 py-2 text-white disabled:opacity-50'
          disabled={loading}
          type='submit'
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <div className='my-4 flex items-center gap-3'>
        <div className='h-px flex-1 bg-stone-200' />
        <span className='text-xs text-stone-500'>OR</span>
        <div className='h-px flex-1 bg-stone-200' />
      </div>
      <SocialLoginButtons returnTo={returnTo} />
      <p className='mt-3 text-sm text-stone-600'>
        <Link className='text-amber-700 hover:underline' href='/forgot-password'>
          Forgot password?
        </Link>
      </p>
      <p className='mt-4 text-sm text-stone-600'>
        New here?{' '}
        <Link className='text-amber-700 hover:underline' href='/signup'>
          Create account
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<main className='mx-auto max-w-md p-8 text-sm text-stone-600'>Loading…</main>}
    >
      <LoginForm />
    </Suspense>
  );
}
