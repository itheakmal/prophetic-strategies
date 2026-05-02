'use client';

import {
  ExternalLink,
  ImagePlus,
  ListChecks,
  Pencil,
  Plus,
  Quote as QuoteIcon,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import AdminFormField from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { adminInputClass, adminSelectClass, adminTextareaClass } from '@/components/admin/input-classes';
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
  const editPanelRef = useRef<HTMLDivElement>(null);

  /** Smooth-scroll to the edit panel whenever a row’s Edit loads details (ignore draft-only updates). */
  useEffect(() => {
    if (!editingId) return;
    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        editPanelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
    return () => {
      cancelAnimationFrame(outerFrame);
      if (innerFrame) cancelAnimationFrame(innerFrame);
    };
  }, [editingId]);

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

      <form
        className='grid gap-4 rounded-xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/70 p-5 shadow-sm'
        onSubmit={onCreate}
      >
        <h2 className='text-lg font-semibold text-stone-900'>Add event</h2>
        <div className='grid gap-4 sm:grid-cols-2'>
          <AdminFormField
            id='create-slug'
            label='Slug'
            hint='URL-safe identifier for the public page /events/[slug]. Use lowercase letters, numbers, and hyphens only.'
          >
            <input
              id='create-slug'
              className={adminInputClass}
              required
              value={creating.slug}
              onChange={e => setCreating(p => ({ ...p, slug: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField
            id='create-title'
            label='Title'
            hint='Display name shown in the timeline, cards, and page heading.'
          >
            <input
              id='create-title'
              className={adminInputClass}
              required
              value={creating.title}
              onChange={e => setCreating(p => ({ ...p, title: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField
            id='create-location'
            label='Location'
            hint='Where this moment takes place—city, region, or narrative place label.'
          >
            <input
              id='create-location'
              className={adminInputClass}
              required
              value={creating.location}
              onChange={e => setCreating(p => ({ ...p, location: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField
            id='create-era'
            label='Era'
            hint='Time-period label for filtering and context (e.g. Meccan, Medinan).'
          >
            <input
              id='create-era'
              className={adminInputClass}
              required
              value={creating.era}
              onChange={e => setCreating(p => ({ ...p, era: e.target.value }))}
            />
          </AdminFormField>
          <AdminFormField
            id='create-order'
            label='Chronology order'
            hint='Integer sort key for ordering events on the timeline; lower values appear earlier unless the UI reverses sort.'
            className='sm:col-span-2'
          >
            <input
              id='create-order'
              className={adminInputClass}
              type='number'
              value={creating.chronologyOrder}
              onChange={e => setCreating(p => ({ ...p, chronologyOrder: Number(e.target.value) }))}
            />
          </AdminFormField>
        </div>
        <AdminFormField
          id='create-context'
          label='Context'
          hint='Full narrative background learners read before deeper content. Rich paragraph text.'
        >
          <textarea
            id='create-context'
            className={adminTextareaClass}
            required
            rows={4}
            value={creating.context}
            onChange={e => setCreating(p => ({ ...p, context: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='create-summary'
          label='Summary'
          hint='Short teaser used in list views and SEO-style previews.'
        >
          <textarea
            id='create-summary'
            className={adminTextareaClass}
            required
            rows={3}
            value={creating.summary}
            onChange={e => setCreating(p => ({ ...p, summary: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='create-deeper'
          label='Deeper points'
          hint='One bullet per line; each becomes a “go deeper” point on the public event page.'
        >
          <textarea
            id='create-deeper'
            className={adminTextareaClass}
            rows={4}
            value={creating.deeper}
            onChange={e => setCreating(p => ({ ...p, deeper: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='create-lessons'
          label='Lessons'
          hint='One lesson per line—practical takeaways shown in the learner UI.'
        >
          <textarea
            id='create-lessons'
            className={adminTextareaClass}
            rows={4}
            value={creating.lessons}
            onChange={e => setCreating(p => ({ ...p, lessons: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='create-parallels'
          label='Parallels'
          hint='One line per parallel theme tying the event to contemporary life.'
        >
          <textarea
            id='create-parallels'
            className={adminTextareaClass}
            rows={3}
            value={creating.parallels}
            onChange={e => setCreating(p => ({ ...p, parallels: e.target.value }))}
          />
        </AdminFormField>
        <AdminButton buttonType='submit' icon={Plus}>
          Add event
        </AdminButton>
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
                <td className='px-4 py-2'>
                  <Link
                    href={`/events/${ev.slug}`}
                    className='inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-950'
                    target='_blank'
                    rel='noreferrer'
                  >
                    View <ExternalLink className='size-3.5' strokeWidth={2} />
                  </Link>
                </td>
                <td className='px-4 py-2'>
                  <div className='flex flex-wrap gap-2'>
                    <AdminButton
                      variant='secondary'
                      icon={Pencil}
                      className='px-3 py-1.5 text-xs'
                      onClick={() => void startEdit(ev.id)}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton variant='danger' icon={Trash2} className='px-3 py-1.5 text-xs' onClick={() => void onDelete(ev)}>
                      Delete
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasEditing && editing && (
        <div
          ref={editPanelRef}
          id='admin-event-edit-panel'
          className='scroll-mt-24 rounded-xl border border-stone-300 bg-gradient-to-b from-white to-stone-50/80 p-5 shadow-lg ring-1 ring-stone-200/80'
        >
          <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
            <h2 className='text-xl font-semibold text-stone-900'>Edit event: {editing.title}</h2>
            <AdminButton
              variant='secondary'
              icon={X}
              className='px-3 py-1.5 text-sm'
              onClick={() => {
                setEditing(null);
                setEditingId(null);
              }}
            >
              Close
            </AdminButton>
          </div>

          <div className='space-y-5'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <AdminFormField label='Slug' hint='Public URL segment; changing it breaks old links bookmarked elsewhere.' id='edit-slug'>
                <input
                  id='edit-slug'
                  className={adminInputClass}
                  value={editing.slug}
                  onChange={e => updateEditing('slug', e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label='Title' hint='Displayed as the headline on /events/[slug].' id='edit-title'>
                <input
                  id='edit-title'
                  className={adminInputClass}
                  value={editing.title}
                  onChange={e => updateEditing('title', e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label='Location' hint='Where this occurrence is situated geographically or narratively.' id='edit-loc'>
                <input
                  id='edit-loc'
                  className={adminInputClass}
                  value={editing.location}
                  onChange={e => updateEditing('location', e.target.value)}
                />
              </AdminFormField>
              <AdminFormField label='Era' hint='Temporal bucket for curricula and filtering.' id='edit-era'>
                <input
                  id='edit-era'
                  className={adminInputClass}
                  value={editing.era}
                  onChange={e => updateEditing('era', e.target.value)}
                />
              </AdminFormField>
              <AdminFormField
                label='Chronology order'
                hint='Controls ordering alongside other timeline events.'
                className='sm:col-span-2'
                id='edit-order'
              >
                <input
                  id='edit-order'
                  className={adminInputClass}
                  type='number'
                  value={editing.chronologyOrder}
                  onChange={e => updateEditing('chronologyOrder', Number(e.target.value))}
                />
              </AdminFormField>
            </div>

            <AdminFormField label='Context' hint='Main story block before expandable sections.' id='edit-context'>
              <textarea
                id='edit-context'
                className={adminTextareaClass}
                rows={5}
                value={editing.context}
                onChange={e => updateEditing('context', e.target.value)}
              />
            </AdminFormField>
            <AdminFormField label='Summary' hint='Condensed synopsis for previews and skim readers.' id='edit-summary'>
              <textarea
                id='edit-summary'
                className={adminTextareaClass}
                rows={3}
                value={editing.summary}
                onChange={e => updateEditing('summary', e.target.value)}
              />
            </AdminFormField>

            <div className='grid gap-4 sm:grid-cols-3'>
              <AdminFormField label='Deeper' hint='Lines become bullet points in “go deeper”.' id='edit-deeper'>
                <textarea
                  id='edit-deeper'
                  className={adminTextareaClass}
                  rows={8}
                  value={editing.deeper.join('\n')}
                  onChange={e =>
                    updateEditing(
                      'deeper',
                      e.target.value.split('\n').map(v => v.trim()).filter(Boolean)
                    )
                  }
                />
              </AdminFormField>
              <AdminFormField label='Lessons' hint='One actionable lesson per line.' id='edit-lessons'>
                <textarea
                  id='edit-lessons'
                  className={adminTextareaClass}
                  rows={8}
                  value={editing.lessons.join('\n')}
                  onChange={e =>
                    updateEditing(
                      'lessons',
                      e.target.value.split('\n').map(v => v.trim()).filter(Boolean)
                    )
                  }
                />
              </AdminFormField>
              <AdminFormField label='Parallels' hint='Modern resonances shown as a list.' id='edit-parallels'>
                <textarea
                  id='edit-parallels'
                  className={adminTextareaClass}
                  rows={8}
                  value={editing.parallels.join('\n')}
                  onChange={e =>
                    updateEditing(
                      'parallels',
                      e.target.value.split('\n').map(v => v.trim()).filter(Boolean)
                    )
                  }
                />
              </AdminFormField>
            </div>

            <div className='space-y-4'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div>
                  <h3 className='font-medium text-stone-900'>Quotes</h3>
                  <p className='mt-0.5 max-w-xl text-xs text-stone-500'>
                    Quotations surfaced in carousel-style blocks—subtitle anchors the excerpt, source credits the narration.
                  </p>
                </div>
                <AdminButton
                  variant='secondary'
                  icon={QuoteIcon}
                  className='px-3 py-1.5 text-xs'
                  onClick={() =>
                    updateEditing('quotes', [
                      ...editing.quotes,
                      { subtitle: '', text: '', source: '', details: '' },
                    ])
                  }
                >
                  Add quote
                </AdminButton>
              </div>
              {editing.quotes.map((q, idx) => (
                <div
                  key={idx}
                  className='grid gap-3 rounded-xl border border-stone-200 bg-white/70 p-4 sm:grid-cols-2'
                >
                  <AdminFormField
                    label='Subtitle'
                    hint='Short headline above the quote body (speaker, theme).'
                    id={`quote-${idx}-sub`}
                  >
                    <input
                      id={`quote-${idx}-sub`}
                      className={adminInputClass}
                      value={q.subtitle}
                      onChange={e => updateQuote(idx, 'subtitle', e.target.value)}
                    />
                  </AdminFormField>
                  <AdminFormField
                    label='Source'
                    hint='Citation or reference line (ḥadīth collection, historian, Qurʾān).'
                    id={`quote-${idx}-src`}
                  >
                    <input
                      id={`quote-${idx}-src`}
                      className={adminInputClass}
                      value={q.source}
                      onChange={e => updateQuote(idx, 'source', e.target.value)}
                    />
                  </AdminFormField>
                  <AdminFormField
                    label='Quote text'
                    hint='Primary passage learners read in the quoted style.'
                    className='sm:col-span-2'
                    id={`quote-${idx}-body`}
                  >
                    <textarea
                      id={`quote-${idx}-body`}
                      className={adminTextareaClass}
                      rows={3}
                      value={q.text}
                      onChange={e => updateQuote(idx, 'text', e.target.value)}
                    />
                  </AdminFormField>
                  <AdminFormField
                    label='Details'
                    hint='Optional footnotes, translation notes, or extra context collapsed by default.'
                    className='sm:col-span-2'
                    id={`quote-${idx}-det`}
                  >
                    <input
                      id={`quote-${idx}-det`}
                      className={adminInputClass}
                      value={q.details ?? ''}
                      onChange={e => updateQuote(idx, 'details', e.target.value)}
                    />
                  </AdminFormField>
                  <div className='sm:col-span-2'>
                    <AdminButton
                      variant='danger'
                      icon={Trash2}
                      className='px-3 py-1.5 text-xs'
                      onClick={() => updateEditing('quotes', editing.quotes.filter((_, i) => i !== idx))}
                    >
                      Remove quote
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>

            <div className='space-y-4'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div>
                  <h3 className='font-medium text-stone-900'>Media</h3>
                  <p className='mt-0.5 max-w-xl text-xs text-stone-500'>
                    Carousel assets; use HTTPS URLs reachable from learner browsers (CDN or uploads).
                  </p>
                </div>
                <AdminButton
                  variant='secondary'
                  icon={ImagePlus}
                  className='px-3 py-1.5 text-xs'
                  onClick={() =>
                    updateEditing('media', [...editing.media, { type: 'image', src: '', alt: '', poster: '' }])
                  }
                >
                  Add media
                </AdminButton>
              </div>
              {editing.media.map((m, idx) => (
                <div
                  key={idx}
                  className='grid gap-3 rounded-xl border border-stone-200 bg-white/70 p-4 sm:grid-cols-2'
                >
                  <AdminFormField
                    label='Media type'
                    hint='Choose image for stills; video expects a playable URL (MP4/HLS landing page embed).'
                    id={`media-${idx}-type`}
                  >
                    <select
                      id={`media-${idx}-type`}
                      className={adminSelectClass}
                      value={m.type}
                      onChange={e => updateMedia(idx, 'type', e.target.value)}
                    >
                      <option value='image'>image</option>
                      <option value='video'>video</option>
                    </select>
                  </AdminFormField>
                  <AdminFormField label='Media URL' hint='Direct asset href or playable stream URL.' id={`media-${idx}-src`}>
                    <input
                      id={`media-${idx}-src`}
                      className={adminInputClass}
                      value={m.src}
                      onChange={e => updateMedia(idx, 'src', e.target.value)}
                    />
                  </AdminFormField>
                  <AdminFormField
                    label='Alt text'
                    hint='Accessibility description for images; omit only for decorative thumbnails.'
                    id={`media-${idx}-alt`}
                  >
                    <input
                      id={`media-${idx}-alt`}
                      className={adminInputClass}
                      value={m.alt ?? ''}
                      onChange={e => updateMedia(idx, 'alt', e.target.value)}
                    />
                  </AdminFormField>
                  <AdminFormField
                    label='Poster'
                    hint='Thumbnail frame shown before learners press play on video entries.'
                    id={`media-${idx}-poster`}
                  >
                    <input
                      id={`media-${idx}-poster`}
                      className={adminInputClass}
                      value={m.poster ?? ''}
                      onChange={e => updateMedia(idx, 'poster', e.target.value)}
                    />
                  </AdminFormField>
                  <div className='sm:col-span-2'>
                    <AdminButton
                      variant='danger'
                      icon={Trash2}
                      className='px-3 py-1.5 text-xs'
                      onClick={() => updateEditing('media', editing.media.filter((_, i) => i !== idx))}
                    >
                      Remove media
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>

            <div className='space-y-4'>
              <div>
                <h3 className='flex items-center gap-2 font-medium text-stone-900'>
                  <ListChecks className='size-4 text-amber-700' strokeWidth={2} aria-hidden /> Follow-ups
                </h3>
                <p className='mt-1 max-w-2xl text-xs text-stone-500'>
                  Interactive checkpoints after the learner reads the narrative—paired “action” and “reaction” prompts with multiple-choice options.
                </p>
              </div>
              {(['action', 'reaction'] as const).map(kind => {
                const f = (editing.followups ?? { action: blankFollowup(), reaction: blankFollowup() })[kind];
                const prefix = `fu-${kind}`;
                return (
                  <div key={kind} className='grid gap-3 rounded-xl border border-stone-200 bg-white/70 p-4'>
                    <p className='text-xs font-bold uppercase tracking-wider text-stone-500'>
                      {kind === 'action' ? 'Action follow-up' : 'Reaction follow-up'}
                    </p>
                    <AdminFormField
                      label='Prompt'
                      hint='Instructions shown above the learner’s answer choices.'
                      id={`${prefix}-prompt`}
                    >
                      <textarea
                        id={`${prefix}-prompt`}
                        className={adminTextareaClass}
                        rows={2}
                        value={f.prompt}
                        onChange={e => updateFollowup(kind, { prompt: e.target.value })}
                      />
                    </AdminFormField>
                    <div className='grid gap-3 sm:grid-cols-3'>
                      <AdminFormField label='Question type' hint='MCQ renders radio cards; dropdown is compact selectors.' id={`${prefix}-type`}>
                        <select
                          id={`${prefix}-type`}
                          className={adminSelectClass}
                          value={f.type}
                          onChange={e => updateFollowup(kind, { type: e.target.value as Followup['type'] })}
                        >
                          <option value='mcq'>mcq</option>
                          <option value='dropdown'>dropdown</option>
                        </select>
                      </AdminFormField>
                      <AdminFormField
                        label='Correct answer index'
                        hint='Zero-based offset into the choices array marking the keyed correct option.'
                        id={`${prefix}-idx`}
                      >
                        <input
                          id={`${prefix}-idx`}
                          className={adminInputClass}
                          type='number'
                          min={0}
                          value={f.correctIndex}
                          onChange={e => updateFollowup(kind, { correctIndex: Number(e.target.value) })}
                        />
                      </AdminFormField>
                      <AdminFormField
                        label='Choices'
                        hint='Separate each learner-facing option using the pipe | character.'
                        id={`${prefix}-choices`}
                      >
                        <input
                          id={`${prefix}-choices`}
                          className={adminInputClass}
                          value={f.choices.join(' | ')}
                          onChange={e =>
                            updateFollowup(kind, {
                              choices: e.target.value.split('|').map(v => v.trim()).filter(Boolean),
                            })
                          }
                        />
                      </AdminFormField>
                    </div>
                    <AdminFormField
                      label='Explanation'
                      hint='Reveal text explaining why the correct answer matters pedagogically.'
                      id={`${prefix}-explain`}
                    >
                      <textarea
                        id={`${prefix}-explain`}
                        className={adminTextareaClass}
                        rows={2}
                        value={f.explanation}
                        onChange={e => updateFollowup(kind, { explanation: e.target.value })}
                      />
                    </AdminFormField>
                  </div>
                );
              })}
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <AdminButton
                variant='primary'
                icon={Save}
                loading={saving}
                onClick={() => void saveEdit()}
              >
                Save changes
              </AdminButton>
              <AdminButton
                variant='secondary'
                icon={X}
                onClick={() => {
                  setEditing(null);
                  setEditingId(null);
                }}
              >
                Cancel
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
