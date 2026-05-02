'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchHomeworkComments,
  fetchHomeworkDetail,
  homeworkFileDownloadUrl,
  postHomeworkComment,
  setHomeworkPinned,
  type HomeworkCommentRow,
  type HomeworkDetail,
} from '@/lib/api/homework';

function authorLabel(a: { name: string | null; email: string }) {
  return a.name?.trim() || a.email.split('@')[0];
}

export default function HomeworkDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [detail, setDetail] = useState<HomeworkDetail | null>(null);
  const [comments, setComments] = useState<HomeworkCommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pinBusy, setPinBusy] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, c] = await Promise.all([
        fetchHomeworkDetail(id),
        fetchHomeworkComments(id),
      ]);
      setDetail(d);
      setComments([...c.comments].reverse());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function onTogglePin() {
    if (!detail || pinBusy) return;
    setPinBusy(true);
    try {
      await setHomeworkPinned(id, !detail.pinnedByMe);
      router.refresh();
      await loadAll();
    } catch {
      /* ignore */
    } finally {
      setPinBusy(false);
    }
  }

  async function onPostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim() || submitting) return;
    setSubmitting(true);
    try {
      const created = await postHomeworkComment(id, commentBody.trim());
      setComments(prev => [...prev, { ...created }]);
      setCommentBody('');
      if (detail) {
        setDetail({ ...detail, commentCount: detail.commentCount + 1 });
      }
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Could not post comment');
    } finally {
      setSubmitting(false);
    }
  }

  function formatKb(n: number) {
    return `${Math.max(1, Math.round(n / 1024))} KB`;
  }

  if (loading && !detail) {
    return <p className='text-sm text-stone-500'>Loading homework…</p>;
  }

  if (error || !detail) {
    return (
      <div className='space-y-4'>
        <p className='text-red-700'>{error ?? 'Not found.'}</p>
        <Link href='/homework' className='text-sm text-amber-800'>
          ← Homework feed
        </Link>
      </div>
    );
  }

  const fileLines = `${detail.files.length} file${detail.files.length === 1 ? '' : 's'} · ${detail.pinCount} pin${
    detail.pinCount === 1 ? '' : 's'
  } on this submission`;

  return (
    <main className='space-y-8'>
      <div>
        <Link href='/homework' className='text-sm text-amber-800'>
          ← Homework feed
        </Link>
        <div className='mt-3 flex flex-wrap items-start justify-between gap-4'>
          <div>
            <h1 className='font-serif text-3xl font-bold text-stone-900'>{detail.title}</h1>
            <p className='mt-1 text-sm text-stone-600'>
              {detail.sessionLabel} · Posted {new Date(detail.createdAt).toLocaleString()} ·{' '}
              <span>{authorLabel(detail.author)}</span>
            </p>
          </div>
          <button
            type='button'
            disabled={pinBusy}
            onClick={() => void onTogglePin()}
            className={`rounded-xl border px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-50 ${
              detail.pinnedByMe
                ? 'border-amber-300 bg-amber-50 text-amber-950'
                : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
            }`}
          >
            {detail.pinnedByMe ? 'Unpin' : 'Pin'}
          </button>
        </div>
      </div>

      <section className='card rounded-2xl border border-stone-200 bg-white p-6 shadow-sm'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-stone-500'>Reflection</h2>
        <p className='mt-2 whitespace-pre-wrap text-stone-800'>{detail.thoughts}</p>
      </section>

      <section className='card rounded-2xl border border-stone-200 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-semibold text-stone-900'>Downloads</h2>
        <p className='mt-1 text-sm text-stone-600'>{fileLines}</p>
        <ul className='mt-4 divide-y divide-stone-100'>
          {detail.files.map(f => (
            <li key={f.id} className='flex flex-wrap items-center justify-between gap-2 py-3'>
              <div>
                <p className='text-sm font-medium text-stone-900'>{f.originalName}</p>
                <p className='text-xs text-stone-500'>
                  {f.mimeType} · {formatKb(f.sizeBytes)}
                </p>
              </div>
              <a
                href={homeworkFileDownloadUrl(id, f.id)}
                className='rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800'
                download
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className='card rounded-2xl border border-stone-200 bg-white p-6 shadow-sm'>
        <div className='flex items-baseline justify-between gap-4'>
          <h2 className='text-lg font-semibold text-stone-900'>Comments</h2>
          <span className='text-sm text-stone-500'>
            {detail.commentCount}{' '}
            {detail.commentCount === 1 ? 'comment' : 'comments'}
          </span>
        </div>

        <ul className='mt-4 space-y-4'>
          {comments.length === 0 ? (
            <li className='text-sm text-stone-500'>No comments yet—start the conversation.</li>
          ) : (
            comments.map(c => (
              <li key={c.id} className='rounded-xl border border-stone-100 bg-stone-50/60 px-4 py-3'>
                <p className='text-xs text-stone-500'>
                  <span className='font-medium text-stone-700'>{authorLabel(c.user)}</span> ·{' '}
                  {new Date(c.createdAt).toLocaleString()}
                </p>
                <p className='mt-2 whitespace-pre-wrap text-sm text-stone-800'>{c.body}</p>
              </li>
            ))
          )}
        </ul>

        <form onSubmit={onPostComment} className='mt-6 space-y-2 border-t border-stone-100 pt-6'>
          <label htmlFor='hw-comment' className='sr-only'>
            Comment
          </label>
          <textarea
            id='hw-comment'
            value={commentBody}
            onChange={e => setCommentBody(e.target.value)}
            rows={4}
            maxLength={4000}
            placeholder='Respond with encouragement or insights…'
            className='w-full rounded-xl border border-stone-200 px-3 py-2 text-sm'
          />
          <button
            type='submit'
            disabled={submitting || !commentBody.trim()}
            className='rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50'
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
        </form>
      </section>
    </main>
  );
}
