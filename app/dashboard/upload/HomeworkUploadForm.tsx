'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomeworkUploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [sessionLabel, setSessionLabel] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.set('title', title);
      fd.set('session', sessionLabel);
      fd.set('thoughts', thoughts);
      if (files) {
        for (let i = 0; i < files.length; i += 1) {
          fd.append('files', files[i]);
        }
      }

      const res = await fetch('/api/homework', { method: 'POST', body: fd });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.success) {
        setError(payload?.error?.message ?? 'Upload failed');
        setLoading(false);
        return;
      }

      const id = payload.data?.id as string | undefined;
      router.push(id ? `/homework/${id}` : '/homework');
      router.refresh();
    } catch {
      setError('Network error');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className='card space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm'>
      {error ? (
        <p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800' role='alert'>
          {error}
        </p>
      ) : null}

      <div>
        <label htmlFor='hw-title' className='block text-sm font-medium text-stone-700'>
          Title
        </label>
        <input
          id='hw-title'
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          maxLength={240}
          className='mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm'
        />
      </div>

      <div>
        <label htmlFor='hw-session' className='block text-sm font-medium text-stone-700'>
          Session label
        </label>
        <input
          id='hw-session'
          value={sessionLabel}
          onChange={e => setSessionLabel(e.target.value)}
          required
          maxLength={240}
          placeholder='Week 3 — Makkan period'
          className='mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm'
        />
      </div>

      <div>
        <label htmlFor='hw-thoughts' className='block text-sm font-medium text-stone-700'>
          Your reflections
        </label>
        <textarea
          id='hw-thoughts'
          value={thoughts}
          onChange={e => setThoughts(e.target.value)}
          required
          rows={8}
          maxLength={12000}
          className='mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm'
        />
      </div>

      <div>
        <label htmlFor='hw-files' className='block text-sm font-medium text-stone-700'>
          Files (images, PDF, or plain text — at least one)
        </label>
        <input
          id='hw-files'
          type='file'
          multiple
          accept='image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain,.pdf,.txt,.jpg,.jpeg,.png,.gif,.webp'
          onChange={e => setFiles(e.target.files)}
          required
          className='mt-1 w-full text-sm text-stone-700 file:mr-3 file:rounded-lg file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-white'
        />
        <p className='mt-1 text-xs text-stone-500'>
          Up to 10 files; 5&nbsp;MB each; 25&nbsp;MB total. Only your cohort (signed-in learners) can download.
        </p>
      </div>

      <div className='flex gap-3'>
        <button
          type='submit'
          disabled={loading}
          className='rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-stone-800 disabled:opacity-60'
        >
          {loading ? 'Submitting…' : 'Submit homework'}
        </button>
      </div>
    </form>
  );
}
