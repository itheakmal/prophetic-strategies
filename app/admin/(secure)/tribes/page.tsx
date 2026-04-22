'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api/admin-browser';

type TribeRow = {
  id: string;
  externalId: string;
  name: string;
  group: string;
  phase: string;
  lat: number;
  lon: number;
};

export default function AdminTribesPage() {
  const [tribes, setTribes] = useState<TribeRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ externalId: '', name: '', group: '', phase: 'meccan', x: 0, y: 0, lat: 0, lon: 0 });

  async function load() {
    try {
      const data = await adminFetch<TribeRow[]>('/api/admin/tribes?phase=meccan');
      setTribes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => { void load(); }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminFetch('/api/admin/tribes', {
        method: 'POST',
        body: JSON.stringify({ ...form, x: Number(form.x), y: Number(form.y), lat: Number(form.lat), lon: Number(form.lon) }),
      });
      setForm({ externalId: '', name: '', group: '', phase: 'meccan', x: 0, y: 0, lat: 0, lon: 0 });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  }

  async function onEdit(tribe: TribeRow) {
    const name = window.prompt('Name', tribe.name);
    if (!name) return;
    const group = window.prompt('Group', tribe.group) ?? tribe.group;
    const phase = window.prompt('Phase', tribe.phase) ?? tribe.phase;
    const externalId = window.prompt('External ID', tribe.externalId) ?? tribe.externalId;
    const lat = Number(window.prompt('Latitude', String(tribe.lat)) ?? tribe.lat);
    const lon = Number(window.prompt('Longitude', String(tribe.lon)) ?? tribe.lon);

    try {
      await adminFetch(`/api/admin/tribes/${tribe.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, group, phase, externalId, lat, lon }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Edit failed');
    }
  }

  async function onDelete(tribe: TribeRow) {
    if (!window.confirm(`Delete tribe "${tribe.name}"?`)) return;
    try {
      await adminFetch(`/api/admin/tribes/${tribe.id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  if (!tribes) return <p className='text-stone-600'>Loading…</p>;

  return (
    <div className='space-y-4'>
      <h1 className='font-serif text-3xl font-bold text-stone-900'>Tribes</h1>
      <form className='grid gap-3 rounded-xl border border-stone-200 p-4 sm:grid-cols-2' onSubmit={onCreate}>
        <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='External ID' required value={form.externalId} onChange={e => setForm(p => ({ ...p, externalId: e.target.value }))} />
        <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Name' required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Group' required value={form.group} onChange={e => setForm(p => ({ ...p, group: e.target.value }))} />
        <input className='rounded-lg border border-stone-300 px-3 py-2' placeholder='Phase' value={form.phase} onChange={e => setForm(p => ({ ...p, phase: e.target.value }))} />
        <input className='rounded-lg border border-stone-300 px-3 py-2' type='number' placeholder='X' value={form.x} onChange={e => setForm(p => ({ ...p, x: Number(e.target.value) }))} />
        <input className='rounded-lg border border-stone-300 px-3 py-2' type='number' placeholder='Y' value={form.y} onChange={e => setForm(p => ({ ...p, y: Number(e.target.value) }))} />
        <input className='rounded-lg border border-stone-300 px-3 py-2' type='number' step='any' placeholder='Latitude' value={form.lat} onChange={e => setForm(p => ({ ...p, lat: Number(e.target.value) }))} />
        <input className='rounded-lg border border-stone-300 px-3 py-2' type='number' step='any' placeholder='Longitude' value={form.lon} onChange={e => setForm(p => ({ ...p, lon: Number(e.target.value) }))} />
        <button type='submit' className='rounded-lg bg-stone-900 px-4 py-2 text-white sm:col-span-2'>Add tribe</button>
      </form>
      {error && <p className='text-rose-700'>{error}</p>}
      <div className='overflow-x-auto rounded-xl border border-stone-200'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-stone-100 text-stone-700'>
            <tr><th className='px-4 py-2'>External ID</th><th className='px-4 py-2'>Name</th><th className='px-4 py-2'>Group</th><th className='px-4 py-2'>Phase</th><th className='px-4 py-2'>Lat / Lon</th><th className='px-4 py-2'>Actions</th></tr>
          </thead>
          <tbody>
            {tribes.map(t => (
              <tr key={t.id} className='border-t border-stone-200'>
                <td className='px-4 py-2 font-mono text-xs'>{t.externalId}</td>
                <td className='px-4 py-2'>{t.name}</td>
                <td className='px-4 py-2'>{t.group}</td>
                <td className='px-4 py-2'>{t.phase}</td>
                <td className='px-4 py-2 text-xs text-stone-600'>{t.lat.toFixed(4)}, {t.lon.toFixed(4)}</td>
                <td className='px-4 py-2 space-x-2'>
                  <button className='rounded bg-stone-200 px-2 py-1 text-xs' onClick={() => void onEdit(t)}>Edit</button>
                  <button className='rounded bg-rose-100 px-2 py-1 text-xs text-rose-700' onClick={() => void onDelete(t)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
