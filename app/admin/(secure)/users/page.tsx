'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api/admin-browser';

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  createdAt: string;
  deletedAt?: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EDITOR' as 'ADMIN' | 'EDITOR' });

  async function load() {
    try {
      const data = await adminFetch<UserRow[]>('/api/admin/users');
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminFetch<UserRow>('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm({ name: '', email: '', password: '', role: 'EDITOR' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  }

  async function onRoleChange(user: UserRow, role: 'ADMIN' | 'EDITOR') {
    try {
      await adminFetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Role update failed');
    }
  }

  async function onDelete(user: UserRow) {
    if (!window.confirm(`Delete user ${user.email}?`)) return;
    try {
      await adminFetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  return (
    <div className='space-y-6'>
      <h1 className='font-serif text-3xl font-bold text-stone-900'>Users</h1>
      <form className='grid gap-3 rounded-xl border border-stone-200 p-4 sm:grid-cols-2' onSubmit={onCreate}>
        <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Name (optional)' value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
        <input className='rounded-lg border border-stone-300 px-3 py-2' type='email' placeholder='Email' required value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
        <input className='rounded-lg border border-stone-300 px-3 py-2' type='password' placeholder='Password' minLength={8} required value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} />
        <select className='rounded-lg border border-stone-300 px-3 py-2' value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value as 'ADMIN' | 'EDITOR' }))}>
          <option value='EDITOR'>EDITOR</option>
          <option value='ADMIN'>ADMIN</option>
        </select>
        <button type='submit' className='rounded-lg bg-stone-900 px-4 py-2 text-white sm:col-span-2'>
          Add user
        </button>
      </form>
      {error && <p className='text-sm text-rose-700'>{error}</p>}
      <div className='overflow-x-auto rounded-xl border border-stone-200'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-stone-100 text-stone-700'>
            <tr>
              <th className='px-4 py-2'>Name</th>
              <th className='px-4 py-2'>Email</th>
              <th className='px-4 py-2'>Role</th>
              <th className='px-4 py-2'>Created</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className='border-t border-stone-200'>
                <td className='px-4 py-2'>{u.name ?? '-'}</td>
                <td className='px-4 py-2'>{u.email}</td>
                <td className='px-4 py-2'>
                  <select
                    className='rounded border border-stone-300 px-2 py-1 text-xs'
                    value={u.role}
                    onChange={e =>
                      void onRoleChange(u, e.target.value as 'ADMIN' | 'EDITOR')
                    }
                  >
                    <option value='EDITOR'>EDITOR</option>
                    <option value='ADMIN'>ADMIN</option>
                  </select>
                </td>
                <td className='px-4 py-2 text-xs text-stone-600'>{new Date(u.createdAt).toLocaleString()}</td>
                <td className='px-4 py-2'>
                  <button
                    type='button'
                    className='rounded bg-rose-100 px-2 py-1 text-xs text-rose-700'
                    onClick={() => void onDelete(u)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
