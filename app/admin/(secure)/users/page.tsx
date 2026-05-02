'use client';

import { Trash2, UserRoundPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminFormField from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { adminInputClass, adminSelectClass } from '@/components/admin/input-classes';
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
      <div>
        <h1 className='font-serif text-3xl font-bold text-stone-900'>Users</h1>
        <p className='mt-1 max-w-2xl text-sm text-stone-600'>
          Provision curriculum editors or elevated admins who can authenticate into this portal alongside public learners on the marketing site.
        </p>
      </div>

      <form
        className='grid gap-4 rounded-xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/70 p-5 shadow-sm sm:grid-cols-2'
        onSubmit={onCreate}
      >
        <AdminFormField
          id='user-name'
          label='Full name'
          hint='Friendly display pulled into audit trails; optional because many editor accounts rely on shared email identities.'
        >
          <input
            id='user-name'
            className={adminInputClass}
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='user-email'
          label='Work email'
          hint='Canonical login identifier; duplicates are rejected.'
        >
          <input
            id='user-email'
            className={adminInputClass}
            type='email'
            required
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='user-password'
          label='Initial password'
          hint='Minimum eight characters—the user should rotate after first login in production deployments.'
          className='sm:col-span-2'
        >
          <input
            id='user-password'
            className={adminInputClass}
            type='password'
            minLength={8}
            required
            autoComplete='new-password'
            value={form.password}
            onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='user-role'
          label='Role'
          hint='ADMIN unlocks destructive actions and privileged APIs; EDITOR suffices for authoring events/tribes/content.'
          className='sm:col-span-2'
        >
          <select
            id='user-role'
            className={adminSelectClass}
            value={form.role}
            onChange={e => setForm(prev => ({ ...prev, role: e.target.value as 'ADMIN' | 'EDITOR' }))}
          >
            <option value='EDITOR'>EDITOR — content ops</option>
            <option value='ADMIN'>ADMIN — full control</option>
          </select>
        </AdminFormField>

        <AdminButton buttonType='submit' icon={UserRoundPlus} className='sm:col-span-2'>
          Add user
        </AdminButton>
      </form>

      {error && <p className='rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800'>{error}</p>}

      <div className='overflow-x-auto rounded-xl border border-stone-200 shadow-sm'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-gradient-to-r from-stone-100 to-stone-50 text-stone-700'>
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
                <td className='px-4 py-2'>{u.name ?? '—'}</td>
                <td className='px-4 py-2 font-mono text-xs text-stone-800'>{u.email}</td>
                <td className='px-4 py-2'>
                  <select
                    className={`${adminSelectClass} max-w-[220px]`}
                    value={u.role}
                    aria-label={`Role for ${u.email}`}
                    onChange={e => void onRoleChange(u, e.target.value as 'ADMIN' | 'EDITOR')}
                  >
                    <option value='EDITOR'>EDITOR</option>
                    <option value='ADMIN'>ADMIN</option>
                  </select>
                </td>
                <td className='px-4 py-2 text-xs text-stone-600'>{new Date(u.createdAt).toLocaleString()}</td>
                <td className='px-4 py-2'>
                  <AdminButton variant='danger' icon={Trash2} className='px-3 py-1.5 text-xs' onClick={() => void onDelete(u)}>
                    Delete
                  </AdminButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
