'use client';

import { useState } from 'react';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  returnTo: string;
}

export default function LoginModal({
  open,
  onClose,
  onSuccess,
  returnTo,
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

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
      onSuccess?.();
      onClose();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='font-serif text-xl font-bold text-stone-900'>
            Log in to save your reflection
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='rounded-md px-2 py-1 text-sm text-stone-600 hover:bg-stone-100'
          >
            Close
          </button>
        </div>
        <form className='space-y-3' onSubmit={submit}>
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
          {error && <p className='text-sm text-rose-700'>{error}</p>}
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
      </div>
    </div>
  );
}
