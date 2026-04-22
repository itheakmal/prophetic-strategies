'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/api/admin-browser';

type EventRow = {
  id: string;
  slug: string;
  title: string;
  era: string;
  location: string;
  chronologyOrder: number;
  deletedAt: string | null;
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    slug: '', title: '', location: '', era: '', context: '', summary: '', chronologyOrder: 0,
    deeper: '', lessons: '', parallels: '',
  });

  async function load() {
    try {
      const rows = await adminFetch<EventRow[]>('/api/admin/events');
      setEvents(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => { void load(); }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminFetch('/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          chronologyOrder: Number(form.chronologyOrder),
          deeper: form.deeper.split('\n').map(s => s.trim()).filter(Boolean),
          lessons: form.lessons.split('\n').map(s => s.trim()).filter(Boolean),
          parallels: form.parallels.split('\n').map(s => s.trim()).filter(Boolean),
          quotes: [],
          media: [],
        }),
      });
      setForm({ slug: '', title: '', location: '', era: '', context: '', summary: '', chronologyOrder: 0, deeper: '', lessons: '', parallels: '' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  }

  async function onEdit(event: EventRow) {
    const title = window.prompt('Title', event.title);
    if (!title) return;
    const location = window.prompt('Location', event.location) ?? event.location;
    const era = window.prompt('Era', event.era) ?? event.era;
    const order = Number(window.prompt('Chronology order', String(event.chronologyOrder)) ?? event.chronologyOrder);
    const slug = window.prompt('Slug', event.slug) ?? event.slug;

    try {
      await adminFetch(`/api/admin/events/${event.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          slug,
          title,
          location,
          era,
          chronologyOrder: order,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Edit failed');
    }
  }

  async function onDelete(event: EventRow) {
    if (!window.confirm(`Delete event "${event.title}"?`)) return;
    try {
      await adminFetch(`/api/admin/events/${event.id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  if (!events) return <p className='text-stone-600'>Loading…</p>;

  return (
    <div className='space-y-4'>
      <h1 className='font-serif text-3xl font-bold text-stone-900'>Events</h1>
      <form className='grid gap-3 rounded-xl border border-stone-200 p-4' onSubmit={onCreate}>
        <div className='grid gap-3 sm:grid-cols-2'>
          <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Slug' required value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
          <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Title' required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Location' required value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
          <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Era' required value={form.era} onChange={e => setForm(p => ({ ...p, era: e.target.value }))} />
          <input className='rounded-lg border border-stone-300 px-3 py-2 sm:col-span-2' type='number' placeholder='Order' value={form.chronologyOrder} onChange={e => setForm(p => ({ ...p, chronologyOrder: Number(e.target.value) }))} />
        </div>
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Context' required value={form.context} onChange={e => setForm(p => ({ ...p, context: e.target.value }))} />
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Summary' required value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} />
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Deeper points (one per line)' value={form.deeper} onChange={e => setForm(p => ({ ...p, deeper: e.target.value }))} />
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Lessons (one per line)' value={form.lessons} onChange={e => setForm(p => ({ ...p, lessons: e.target.value }))} />
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Parallels (one per line)' value={form.parallels} onChange={e => setForm(p => ({ ...p, parallels: e.target.value }))} />
        <button className='rounded-lg bg-stone-900 px-4 py-2 text-white' type='submit'>Add event</button>
      </form>
      {error && <p className='text-rose-700'>{error}</p>}
      <div className='overflow-x-auto rounded-xl border border-stone-200'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-stone-100 text-stone-700'>
            <tr><th className='px-4 py-2'>Order</th><th className='px-4 py-2'>Slug</th><th className='px-4 py-2'>Title</th><th className='px-4 py-2'>Era</th><th className='px-4 py-2'>Location</th><th className='px-4 py-2'>Public</th><th className='px-4 py-2'>Actions</th></tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} className='border-t border-stone-200'>
                <td className='px-4 py-2'>{ev.chronologyOrder}</td>
                <td className='px-4 py-2 font-mono text-xs'>{ev.slug}</td>
                <td className='px-4 py-2'>{ev.title}</td>
                <td className='px-4 py-2'>{ev.era}</td>
                <td className='px-4 py-2'>{ev.location}</td>
                <td className='px-4 py-2'><Link href={`/events/${ev.slug}`} className='text-amber-700 hover:underline' target='_blank' rel='noreferrer'>View</Link></td>
                <td className='px-4 py-2 space-x-2'>
                  <button className='rounded bg-stone-200 px-2 py-1 text-xs' onClick={() => void onEdit(ev)}>Edit</button>
                  <button className='rounded bg-rose-100 px-2 py-1 text-xs text-rose-700' onClick={() => void onDelete(ev)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
