'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { HomeworkFeedItem } from '@/lib/api/homework';
import { fetchHomeworkFeed } from '@/lib/api/homework';

export default function HomeworkFeedPage() {
  const [tab, setTab] = useState<'all' | 'pinned' | 'mine'>('all');
  const [items, setItems] = useState<HomeworkFeedItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pinnedOnly = tab === 'pinned';
  const mineOnly = tab === 'mine';

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHomeworkFeed({ pinnedOnly, mineOnly, take: 20 });
      setItems(data.items);
      setCursor(data.nextCursor);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load homework');
      setItems([]);
      setCursor(null);
    } finally {
      setLoading(false);
    }
  }, [pinnedOnly, mineOnly]);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function loadMore() {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchHomeworkFeed({ pinnedOnly, mineOnly, cursor, take: 20 });
      setItems(prev => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch {
      /* ignore incremental errors */
    } finally {
      setLoadingMore(false);
    }
  }

  function displayName(row: HomeworkFeedItem['author']) {
    return row.name?.trim() || row.email.split('@')[0];
  }

  return (
    <main className='space-y-6'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='font-serif text-3xl font-bold text-stone-900'>Homework</h1>
          <p className='mt-1 text-sm text-stone-600'>
            Submissions from learners. Pins are yours only—they help you find work to revisit.
          </p>
        </div>
        <div className='flex flex-wrap rounded-xl border border-stone-200 bg-stone-100 p-1 text-sm'>
          <button
            type='button'
            onClick={() => setTab('all')}
            className={`cursor-pointer rounded-lg px-4 py-1.5 font-medium ${
              tab === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            All
          </button>
          <button
            type='button'
            onClick={() => setTab('mine')}
            className={`cursor-pointer rounded-lg px-4 py-1.5 font-medium ${
              tab === 'mine' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            Mine
          </button>
          <button
            type='button'
            onClick={() => setTab('pinned')}
            className={`cursor-pointer rounded-lg px-4 py-1.5 font-medium ${
              tab === 'pinned' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            Pinned
          </button>
        </div>
      </div>

      {error ? (
        <p className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'>{error}</p>
      ) : null}

      {loading ? (
        <p className='text-sm text-stone-500'>Loading submissions…</p>
      ) : items.length === 0 ? (
        <p className='text-sm text-stone-600'>
          {mineOnly
            ? 'You have not uploaded any homework yet—use Dashboard → Upload homework.'
            : pinnedOnly
              ? 'Nothing pinned yet. Open the “All” tab and pin posts you care about.'
              : 'No homework yet.'}
        </p>
      ) : (
        <ul className='space-y-4'>
          {items.map(item => (
            <li key={item.id}>
              <Link
                href={`/homework/${item.id}`}
                className='block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-amber-200 hover:shadow'
              >
                <div className='flex flex-wrap items-start justify-between gap-2'>
                  <div>
                    <h2 className='text-lg font-semibold text-stone-900'>{item.title}</h2>
                    <p className='text-xs text-stone-500'>
                      {item.sessionLabel} · {new Date(item.createdAt).toLocaleString()} ·{' '}
                      <span>{displayName(item.author)}</span>
                    </p>
                  </div>
                  <div className='flex gap-3 text-xs text-stone-500'>
                    <span>{item.fileCount} file{item.fileCount === 1 ? '' : 's'}</span>
                    <span>{item.commentCount} comment{item.commentCount === 1 ? '' : 's'}</span>
                    {item.pinnedByMe ? (
                      <span className='font-medium text-amber-800'>Pinned</span>
                    ) : null}
                  </div>
                </div>
                <p className='mt-3 line-clamp-3 whitespace-pre-wrap text-sm text-stone-700'>
                  {item.thoughtsPreview}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {cursor ? (
        <button
          type='button'
          onClick={() => loadMore()}
          disabled={loadingMore}
          className='cursor-pointer rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      ) : null}
    </main>
  );
}
