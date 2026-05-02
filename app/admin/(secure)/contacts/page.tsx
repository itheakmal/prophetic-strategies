'use client';

import { Inbox } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminTableColumnHint from '@/components/admin/AdminTableColumnHint';
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
    return <p className='rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800'>{error}</p>;
  }
  if (!rows) {
    return <p className='text-stone-600'>Loading…</p>;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='flex flex-wrap items-center gap-3 font-serif text-3xl font-bold text-stone-900'>
          <span className='flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-stone-900 to-stone-950 text-white shadow-md'>
            <Inbox className='size-5' strokeWidth={2} aria-hidden />
          </span>
          Contact submissions
        </h1>
        <p className='mt-2 max-w-2xl text-sm text-stone-600'>
          Rows mirror the sanitized payloads captured by `/api/contact`, including moderation status once operators triage outreach.
          Hover each column title’s help bubble for ingestion notes.
        </p>
      </div>

      <div className='overflow-x-auto rounded-xl border border-stone-200 shadow-sm'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-gradient-to-r from-stone-100 to-stone-50 text-stone-700'>
            <tr>
              <th className='px-4 py-2'>
                <AdminTableColumnHint
                  label='When'
                  hint='Server-side timestamp reflecting when Resend ingestion completed and the row persisted to MySQL.'
                />
              </th>
              <th className='px-4 py-2'>
                <AdminTableColumnHint label='Sender name' hint='Visitor-provided name string from the landing page form.' />
              </th>
              <th className='px-4 py-2'>
                <AdminTableColumnHint label='Email' hint='Reply-to mailbox—validate before initiating sensitive conversations.' />
              </th>
              <th className='px-4 py-2'>
                <AdminTableColumnHint label='Subject' hint='One-line synopsis chosen by submitter summarizing intent.' />
              </th>
              <th className='px-4 py-2'>
                <AdminTableColumnHint
                  label='Status'
                  hint='Pipeline flag (received, contacted, archived, etc.). Extend enum to match CRM automation.'
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className='border-t border-stone-200 align-top'>
                <td className='whitespace-nowrap px-4 py-2 text-xs text-stone-600'>{new Date(r.createdAt).toLocaleString()}</td>
                <td className='px-4 py-2 font-medium text-stone-900'>{r.name}</td>
                <td className='px-4 py-2 font-mono text-xs text-stone-800'>{r.email}</td>
                <td className='px-4 py-2'>{r.subject}</td>
                <td className='px-4 py-2'>
                  <span className='inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-900'>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
