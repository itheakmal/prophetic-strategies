'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api/admin-browser';

type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
};

export default function AdminContactsPage() {
  const [rows, setRows] = useState<ContactRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<ContactRow[]>('/api/admin/contacts')
      .then(setRows)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  if (error) {
    return <p className='text-rose-700'>{error}</p>;
  }
  if (!rows) {
    return <p className='text-stone-600'>Loading…</p>;
  }

  return (
    <div className='space-y-4'>
      <h1 className='font-serif text-3xl font-bold text-stone-900'>Contact submissions</h1>
      <div className='overflow-x-auto rounded-xl border border-stone-200'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-stone-100 text-stone-700'>
            <tr>
              <th className='px-4 py-2'>When</th>
              <th className='px-4 py-2'>Name</th>
              <th className='px-4 py-2'>Email</th>
              <th className='px-4 py-2'>Subject</th>
              <th className='px-4 py-2'>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className='border-t border-stone-200 align-top'>
                <td className='px-4 py-2 whitespace-nowrap text-xs text-stone-600'>
                  {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className='px-4 py-2'>{r.name}</td>
                <td className='px-4 py-2'>{r.email}</td>
                <td className='px-4 py-2'>{r.subject}</td>
                <td className='px-4 py-2'>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
