'use client';

import { useEffect, useMemo, useState } from 'react';
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

type Quote = { subtitle: string; text: string; source: string; details?: string };
type Media = { type: 'image' | 'video'; src: string; alt?: string; poster?: string };
type Followup = {
  prompt: string;
  type: 'dropdown' | 'mcq';
  choices: string[];
  correctIndex: number;
  explanation: string;
};

type EventDetail = {
  id: string;
  slug: string;
  title: string;
  location: string;
  era: string;
  context: string;
  summary: string;
  chronologyOrder: number;
  deeper: string[];
  lessons: string[];
  parallels: string[];
  quotes: Quote[];
  media: Media[];
  followups?: {
    action: Followup;
    reaction: Followup;
  };
};

function blankFollowup(): Followup {
  return {
    prompt: '',
    type: 'mcq',
    choices: ['', ''],
    correctIndex: 0,
    explanation: '',
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState({
    slug: '',
    title: '',
    location: '',
    era: '',
    context: '',
    summary: '',
    chronologyOrder: 0,
    deeper: '',
    lessons: '',
    parallels: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<EventDetail | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const rows = await adminFetch<EventRow[]>('/api/admin/events');
      setEvents(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminFetch('/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({
          ...creating,
          chronologyOrder: Number(creating.chronologyOrder),
          deeper: creating.deeper.split('\n').map(s => s.trim()).filter(Boolean),
          lessons: creating.lessons.split('\n').map(s => s.trim()).filter(Boolean),
          parallels: creating.parallels.split('\n').map(s => s.trim()).filter(Boolean),
          quotes: [],
          media: [],
        }),
      });
      setCreating({ slug: '', title: '', location: '', era: '', context: '', summary: '', chronologyOrder: 0, deeper: '', lessons: '', parallels: '' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  }

  async function startEdit(eventId: string) {
    try {
      setError(null);
      const detail = await adminFetch<EventDetail>(`/api/admin/events/${eventId}`);
      detail.followups = detail.followups ?? { action: blankFollowup(), reaction: blankFollowup() };
      setEditingId(eventId);
      setEditing(detail);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load event details');
    }
  }

  function updateEditing<K extends keyof EventDetail>(key: K, value: EventDetail[K]) {
    setEditing(prev => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateQuote(index: number, field: keyof Quote, value: string) {
    if (!editing) return;
    const quotes = [...editing.quotes];
    quotes[index] = { ...quotes[index], [field]: value };
    updateEditing('quotes', quotes);
  }

  function updateMedia(index: number, field: keyof Media, value: string) {
    if (!editing) return;
    const media = [...editing.media];
    media[index] = {
      ...media[index],
      [field]: field === 'type' ? (value as Media['type']) : value,
    };
    updateEditing('media', media);
  }

  function updateFollowup(type: 'action' | 'reaction', patch: Partial<Followup>) {
    if (!editing) return;
    const current = editing.followups ?? { action: blankFollowup(), reaction: blankFollowup() };
    updateEditing('followups', {
      ...current,
      [type]: {
        ...current[type],
        ...patch,
      },
    });
  }

  async function saveEdit() {
    if (!editing || !editingId) return;
    setSaving(true);
    setError(null);

    try {
      await adminFetch(`/api/admin/events/${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          slug: editing.slug,
          title: editing.title,
          location: editing.location,
          era: editing.era,
          context: editing.context,
          summary: editing.summary,
          chronologyOrder: Number(editing.chronologyOrder),
          deeper: editing.deeper,
          lessons: editing.lessons,
          parallels: editing.parallels,
          quotes: editing.quotes,
          media: editing.media,
          followups: editing.followups,
        }),
      });
      await load();
      setEditing(null);
      setEditingId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(event: EventRow) {
    if (!window.confirm(`Delete event "${event.title}"?`)) return;
    try {
      await adminFetch(`/api/admin/events/${event.id}`, { method: 'DELETE' });
      if (editingId === event.id) {
        setEditingId(null);
        setEditing(null);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  const hasEditing = useMemo(() => Boolean(editing && editingId), [editing, editingId]);

  if (!events) return <p className='text-stone-600'>Loading…</p>;

  return (
    <div className='space-y-6'>
      <h1 className='font-serif text-3xl font-bold text-stone-900'>Events</h1>

      <form className='grid gap-3 rounded-xl border border-stone-200 p-4' onSubmit={onCreate}>
        <h2 className='text-lg font-semibold text-stone-900'>Add event</h2>
        <div className='grid gap-3 sm:grid-cols-2'>
          <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Slug' required value={creating.slug} onChange={e => setCreating(p => ({ ...p, slug: e.target.value }))} />
          <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Title' required value={creating.title} onChange={e => setCreating(p => ({ ...p, title: e.target.value }))} />
          <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Location' required value={creating.location} onChange={e => setCreating(p => ({ ...p, location: e.target.value }))} />
          <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Era' required value={creating.era} onChange={e => setCreating(p => ({ ...p, era: e.target.value }))} />
          <input className='rounded-lg border border-stone-300 px-3 py-2 sm:col-span-2' type='number' placeholder='Order' value={creating.chronologyOrder} onChange={e => setCreating(p => ({ ...p, chronologyOrder: Number(e.target.value) }))} />
        </div>
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Context' required value={creating.context} onChange={e => setCreating(p => ({ ...p, context: e.target.value }))} />
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Summary' required value={creating.summary} onChange={e => setCreating(p => ({ ...p, summary: e.target.value }))} />
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Deeper points (one per line)' value={creating.deeper} onChange={e => setCreating(p => ({ ...p, deeper: e.target.value }))} />
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Lessons (one per line)' value={creating.lessons} onChange={e => setCreating(p => ({ ...p, lessons: e.target.value }))} />
        <textarea className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Parallels (one per line)' value={creating.parallels} onChange={e => setCreating(p => ({ ...p, parallels: e.target.value }))} />
        <button className='rounded-lg bg-stone-900 px-4 py-2 text-white' type='submit'>Add event</button>
      </form>

      {error && <p className='text-rose-700'>{error}</p>}

      <div className='overflow-x-auto rounded-xl border border-stone-200'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-stone-100 text-stone-700'>
            <tr>
              <th className='px-4 py-2'>Order</th>
              <th className='px-4 py-2'>Slug</th>
              <th className='px-4 py-2'>Title</th>
              <th className='px-4 py-2'>Era</th>
              <th className='px-4 py-2'>Location</th>
              <th className='px-4 py-2'>Public</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
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
                  <button className='rounded bg-stone-200 px-2 py-1 text-xs' onClick={() => void startEdit(ev.id)}>Edit</button>
                  <button className='rounded bg-rose-100 px-2 py-1 text-xs text-rose-700' onClick={() => void onDelete(ev)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasEditing && editing && (
        <div className='rounded-xl border border-stone-300 bg-white p-5 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-stone-900'>Edit event: {editing.title}</h2>
            <button className='rounded border border-stone-300 px-3 py-1 text-sm' onClick={() => { setEditing(null); setEditingId(null); }}>
              Close
            </button>
          </div>

          <div className='space-y-5'>
            <div className='grid gap-3 sm:grid-cols-2'>
              <input className='rounded-lg border border-stone-300 px-3 py-2' value={editing.slug} onChange={e => updateEditing('slug', e.target.value)} placeholder='Slug' />
              <input className='rounded-lg border border-stone-300 px-3 py-2' value={editing.title} onChange={e => updateEditing('title', e.target.value)} placeholder='Title' />
              <input className='rounded-lg border border-stone-300 px-3 py-2' value={editing.location} onChange={e => updateEditing('location', e.target.value)} placeholder='Location' />
              <input className='rounded-lg border border-stone-300 px-3 py-2' value={editing.era} onChange={e => updateEditing('era', e.target.value)} placeholder='Era' />
              <input className='rounded-lg border border-stone-300 px-3 py-2 sm:col-span-2' type='number' value={editing.chronologyOrder} onChange={e => updateEditing('chronologyOrder', Number(e.target.value))} placeholder='Order' />
            </div>

            <textarea className='w-full rounded-lg border border-stone-300 px-3 py-2' value={editing.context} onChange={e => updateEditing('context', e.target.value)} placeholder='Context' />
            <textarea className='w-full rounded-lg border border-stone-300 px-3 py-2' value={editing.summary} onChange={e => updateEditing('summary', e.target.value)} placeholder='Summary' />

            <div className='grid gap-3 sm:grid-cols-3'>
              <textarea className='rounded-lg border border-stone-300 px-3 py-2' value={editing.deeper.join('\n')} onChange={e => updateEditing('deeper', e.target.value.split('\n').map(v => v.trim()).filter(Boolean))} placeholder='Deeper (one per line)' />
              <textarea className='rounded-lg border border-stone-300 px-3 py-2' value={editing.lessons.join('\n')} onChange={e => updateEditing('lessons', e.target.value.split('\n').map(v => v.trim()).filter(Boolean))} placeholder='Lessons (one per line)' />
              <textarea className='rounded-lg border border-stone-300 px-3 py-2' value={editing.parallels.join('\n')} onChange={e => updateEditing('parallels', e.target.value.split('\n').map(v => v.trim()).filter(Boolean))} placeholder='Parallels (one per line)' />
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='font-medium text-stone-900'>Quotes</h3>
                <button className='rounded bg-stone-200 px-2 py-1 text-xs' onClick={() => updateEditing('quotes', [...editing.quotes, { subtitle: '', text: '', source: '', details: '' }])}>Add quote</button>
              </div>
              {editing.quotes.map((q, idx) => (
                <div key={idx} className='grid gap-2 rounded border border-stone-200 p-3 sm:grid-cols-2'>
                  <input className='rounded border border-stone-300 px-2 py-1' value={q.subtitle} onChange={e => updateQuote(idx, 'subtitle', e.target.value)} placeholder='Subtitle' />
                  <input className='rounded border border-stone-300 px-2 py-1' value={q.source} onChange={e => updateQuote(idx, 'source', e.target.value)} placeholder='Source' />
                  <textarea className='rounded border border-stone-300 px-2 py-1 sm:col-span-2' value={q.text} onChange={e => updateQuote(idx, 'text', e.target.value)} placeholder='Text' />
                  <input className='rounded border border-stone-300 px-2 py-1 sm:col-span-2' value={q.details ?? ''} onChange={e => updateQuote(idx, 'details', e.target.value)} placeholder='Details (optional)' />
                  <div className='sm:col-span-2'>
                    <button className='rounded bg-rose-100 px-2 py-1 text-xs text-rose-700' onClick={() => updateEditing('quotes', editing.quotes.filter((_, i) => i !== idx))}>Remove quote</button>
                  </div>
                </div>
              ))}
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='font-medium text-stone-900'>Media</h3>
                <button className='rounded bg-stone-200 px-2 py-1 text-xs' onClick={() => updateEditing('media', [...editing.media, { type: 'image', src: '', alt: '', poster: '' }])}>Add media</button>
              </div>
              {editing.media.map((m, idx) => (
                <div key={idx} className='grid gap-2 rounded border border-stone-200 p-3 sm:grid-cols-2'>
                  <select className='rounded border border-stone-300 px-2 py-1' value={m.type} onChange={e => updateMedia(idx, 'type', e.target.value)}>
                    <option value='image'>image</option>
                    <option value='video'>video</option>
                  </select>
                  <input className='rounded border border-stone-300 px-2 py-1' value={m.src} onChange={e => updateMedia(idx, 'src', e.target.value)} placeholder='Source URL' />
                  <input className='rounded border border-stone-300 px-2 py-1' value={m.alt ?? ''} onChange={e => updateMedia(idx, 'alt', e.target.value)} placeholder='Alt (optional)' />
                  <input className='rounded border border-stone-300 px-2 py-1' value={m.poster ?? ''} onChange={e => updateMedia(idx, 'poster', e.target.value)} placeholder='Poster URL (video optional)' />
                  <div className='sm:col-span-2'>
                    <button className='rounded bg-rose-100 px-2 py-1 text-xs text-rose-700' onClick={() => updateEditing('media', editing.media.filter((_, i) => i !== idx))}>Remove media</button>
                  </div>
                </div>
              ))}
            </div>

            <div className='space-y-3'>
              <h3 className='font-medium text-stone-900'>Followups</h3>
              {(['action', 'reaction'] as const).map(kind => {
                const f = (editing.followups ?? { action: blankFollowup(), reaction: blankFollowup() })[kind];
                return (
                  <div key={kind} className='grid gap-2 rounded border border-stone-200 p-3'>
                    <p className='text-sm font-semibold uppercase text-stone-600'>{kind}</p>
                    <textarea className='rounded border border-stone-300 px-2 py-1' value={f.prompt} onChange={e => updateFollowup(kind, { prompt: e.target.value })} placeholder='Prompt' />
                    <div className='grid gap-2 sm:grid-cols-3'>
                      <select className='rounded border border-stone-300 px-2 py-1' value={f.type} onChange={e => updateFollowup(kind, { type: e.target.value as Followup['type'] })}>
                        <option value='mcq'>mcq</option>
                        <option value='dropdown'>dropdown</option>
                      </select>
                      <input className='rounded border border-stone-300 px-2 py-1' type='number' min={0} value={f.correctIndex} onChange={e => updateFollowup(kind, { correctIndex: Number(e.target.value) })} placeholder='Correct index' />
                      <input className='rounded border border-stone-300 px-2 py-1' value={f.choices.join(' | ')} onChange={e => updateFollowup(kind, { choices: e.target.value.split('|').map(v => v.trim()).filter(Boolean) })} placeholder='Choices split by |' />
                    </div>
                    <textarea className='rounded border border-stone-300 px-2 py-1' value={f.explanation} onChange={e => updateFollowup(kind, { explanation: e.target.value })} placeholder='Explanation' />
                  </div>
                );
              })}
            </div>

            <div className='flex items-center gap-3'>
              <button className='rounded-lg bg-stone-900 px-4 py-2 text-white disabled:opacity-50' disabled={saving} onClick={() => void saveEdit()}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button className='rounded border border-stone-300 px-4 py-2 text-sm' onClick={() => { setEditing(null); setEditingId(null); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
