'use client';

import { LockKeyhole, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminFormField from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { adminInputClass } from '@/components/admin/input-classes';

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
    <div className='mx-auto max-w-md rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/80 p-8 shadow-xl ring-1 ring-stone-100'>
      <div className='mb-2 flex items-center gap-2'>
        <span className='flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-stone-900 to-stone-950 text-white shadow-md'>
          <LockKeyhole className='size-5' strokeWidth={2} aria-hidden />
        </span>
        <div>
          <h1 className='font-serif text-2xl font-bold text-stone-900'>Admin sign in</h1>
          <p className='text-sm text-stone-600'>
            Operators only — use{' '}
            <code className='rounded bg-stone-100 px-1 text-xs'>ADMIN_EMAIL</code> /{' '}
            <code className='rounded bg-stone-100 px-1 text-xs'>ADMIN_PASSWORD</code>.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className='mt-6 space-y-4'>
        <AdminFormField
          id='admin-email'
          label='Administrator email'
          hint='Must match ADMIN_EMAIL configured in your deployment secrets or local .env file.'
        >
          <input
            id='admin-email'
            type='email'
            autoComplete='username'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={adminInputClass}
            required
          />
        </AdminFormField>

        <AdminFormField
          id='admin-password'
          label='Password'
          hint='Paired credential from ADMIN_PASSWORD. Treat like production infrastructure—never reuse personal passwords.'
        >
          <input
            id='admin-password'
            type='password'
            autoComplete='current-password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={adminInputClass}
            required
          />
        </AdminFormField>

        {error ? (
          <p className='rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800' role='alert'>
            {error}
          </p>
        ) : null}

        <AdminButton loading={loading} icon={loading ? undefined : LogIn} buttonType='submit' className='w-full py-3'>
          {loading ? 'Signing in…' : 'Sign in'}
        </AdminButton>
      </form>
    </div>
  );
}
