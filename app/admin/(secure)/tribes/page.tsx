'use client';

import { Pencil, Plus, Save, Trash2, Users, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AdminFormField from '@/components/admin/AdminFormField';
import { AdminButton } from '@/components/admin/AdminButton';
import { adminInputClass } from '@/components/admin/input-classes';
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

type TribeEditDraft = {
  externalId: string;
  name: string;
  group: string;
  phase: string;
  x: number;
  y: number;
  lat: number;
  lon: number;
};

export default function AdminTribesPage() {
  const [tribes, setTribes] = useState<TribeRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    externalId: '',
    name: '',
    group: '',
    phase: 'meccan',
    x: 0,
    y: 0,
    lat: 0,
    lon: 0,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<TribeEditDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const editPanelRef = useRef<HTMLDivElement>(null);

  const hasEditing = useMemo(() => Boolean(editingId && editingDraft), [editingId, editingDraft]);

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
      const data = await adminFetch<TribeRow[]>('/api/admin/tribes?phase=meccan');
      setTribes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function closeEditor() {
    setEditingId(null);
    setEditingDraft(null);
  }

  async function startEdit(row: TribeRow) {
    setError(null);
    try {
      const d = await adminFetch<{
        externalId: string;
        name: string;
        group: string;
        phase: string;
        x: number;
        y: number;
        lat: number;
        lon: number;
      }>(`/api/admin/tribes/${row.id}`);
      setEditingId(row.id);
      setEditingDraft({
        externalId: d.externalId,
        name: d.name,
        group: d.group,
        phase: d.phase,
        x: Number(d.x),
        y: Number(d.y),
        lat: Number(d.lat),
        lon: Number(d.lon),
      });
    } catch (e) {
      setEditingId(null);
      setEditingDraft(null);
      setError(e instanceof Error ? e.message : 'Failed to load tribe for editing');
    }
  }

  async function saveEdit() {
    if (!editingId || !editingDraft) return;
    setSaving(true);
    setError(null);
    try {
      await adminFetch(`/api/admin/tribes/${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          externalId: editingDraft.externalId,
          name: editingDraft.name,
          group: editingDraft.group,
          phase: editingDraft.phase,
          x: Number(editingDraft.x),
          y: Number(editingDraft.y),
          lat: Number(editingDraft.lat),
          lon: Number(editingDraft.lon),
        }),
      });
      closeEditor();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminFetch('/api/admin/tribes', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          x: Number(form.x),
          y: Number(form.y),
          lat: Number(form.lat),
          lon: Number(form.lon),
        }),
      });
      setForm({
        externalId: '',
        name: '',
        group: '',
        phase: 'meccan',
        x: 0,
        y: 0,
        lat: 0,
        lon: 0,
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    }
  }

  async function onDelete(tribe: TribeRow) {
    if (!window.confirm(`Delete tribe "${tribe.name}"?`)) return;
    try {
      await adminFetch(`/api/admin/tribes/${tribe.id}`, { method: 'DELETE' });
      if (editingId === tribe.id) closeEditor();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  if (!tribes) return <p className='text-stone-600'>Loading…</p>;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='flex items-center gap-2 font-serif text-3xl font-bold text-stone-900'>
          <Users className='size-8 text-amber-800' strokeWidth={2} aria-hidden />
          Tribes
        </h1>
        <p className='mt-1 max-w-2xl text-sm text-stone-600'>
          Graph nodes powering the tribes explorer and geographic overlays. Stable <code className='rounded bg-stone-100 px-1 text-xs'>externalId</code> values keep seed data merges predictable.
        </p>
      </div>

      <form
        className='grid gap-4 rounded-xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/70 p-5 shadow-sm sm:grid-cols-2'
        onSubmit={onCreate}
      >
        <AdminFormField
          id='tr-external'
          label='External ID'
          hint='Immutable business key synced from graph JSON or imports; avoids renaming collisions when migrating data.'
        >
          <input
            id='tr-external'
            className={adminInputClass}
            required
            value={form.externalId}
            onChange={e => setForm(p => ({ ...p, externalId: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField id='tr-name' label='Display name' hint='Human-readable tribe label surfaced in legends and hover cards.'>
          <input
            id='tr-name'
            className={adminInputClass}
            required
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='tr-group'
          label='Alliance group'
          hint='Cluster tribes for coloring (e.g. Qurashī bloc vs confederates) in diagrams.'
        >
          <input
            id='tr-group'
            className={adminInputClass}
            required
            value={form.group}
            onChange={e => setForm(p => ({ ...p, group: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='tr-phase'
          label='Phase'
          hint='Meccan vs Medinan (or future phases): filters which datasets load alongside this node.'
        >
          <input
            id='tr-phase'
            className={adminInputClass}
            value={form.phase}
            onChange={e => setForm(p => ({ ...p, phase: e.target.value }))}
          />
        </AdminFormField>
        <AdminFormField
          id='tr-x'
          label='Layout X'
          hint='Approximate planar coordinate for authored graph layouts prior to projecting lat/lon.'
        >
          <input
            id='tr-x'
            className={adminInputClass}
            type='number'
            value={form.x}
            onChange={e => setForm(p => ({ ...p, x: Number(e.target.value) }))}
          />
        </AdminFormField>
        <AdminFormField
          id='tr-y'
          label='Layout Y'
          hint='Partner axis to Layout X—used while tuning static graph previews.'
        >
          <input
            id='tr-y'
            className={adminInputClass}
            type='number'
            value={form.y}
            onChange={e => setForm(p => ({ ...p, y: Number(e.target.value) }))}
          />
        </AdminFormField>
        <AdminFormField
          id='tr-lat'
          label='Latitude'
          hint='Decimal degrees north/south feeding MapLibre layers and compass-accurate routes.'
        >
          <input
            id='tr-lat'
            className={adminInputClass}
            type='number'
            step='any'
            value={form.lat}
            onChange={e => setForm(p => ({ ...p, lat: Number(e.target.value) }))}
          />
        </AdminFormField>
        <AdminFormField
          id='tr-lon'
          label='Longitude'
          hint='Decimal degrees east/west; pair with Latitude for pinning encampments or cities.'
        >
          <input
            id='tr-lon'
            className={adminInputClass}
            type='number'
            step='any'
            value={form.lon}
            onChange={e => setForm(p => ({ ...p, lon: Number(e.target.value) }))}
          />
        </AdminFormField>
        <AdminButton buttonType='submit' icon={Plus} className='sm:col-span-2'>
          Add tribe
        </AdminButton>
      </form>

      {error && <p className='rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800'>{error}</p>}

      <div className='overflow-x-auto rounded-xl border border-stone-200 shadow-sm'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-gradient-to-r from-stone-100 to-stone-50 text-stone-700'>
            <tr>
              <th className='px-4 py-2'>External ID</th>
              <th className='px-4 py-2'>Name</th>
              <th className='px-4 py-2'>Group</th>
              <th className='px-4 py-2'>Phase</th>
              <th className='px-4 py-2'>Lat / Lon</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tribes.map(t => (
              <tr key={t.id} className='border-t border-stone-200'>
                <td className='px-4 py-2 font-mono text-xs'>{t.externalId}</td>
                <td className='px-4 py-2 font-medium text-stone-900'>{t.name}</td>
                <td className='px-4 py-2'>{t.group}</td>
                <td className='px-4 py-2'>{t.phase}</td>
                <td className='px-4 py-2 text-xs text-stone-600'>
                  {t.lat.toFixed(4)}, {t.lon.toFixed(4)}
                </td>
                <td className='px-4 py-2'>
                  <div className='flex flex-wrap gap-2'>
                    <AdminButton
                      variant='secondary'
                      icon={Pencil}
                      className='px-3 py-1.5 text-xs'
                      onClick={() => void startEdit(t)}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton variant='danger' icon={Trash2} className='px-3 py-1.5 text-xs' onClick={() => void onDelete(t)}>
                      Delete
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasEditing && editingDraft && (
        <div
          ref={editPanelRef}
          id='admin-tribe-edit-panel'
          className='scroll-mt-24 rounded-xl border border-stone-300 bg-gradient-to-b from-white to-stone-50/80 p-5 shadow-lg ring-1 ring-stone-200/80'
        >
          <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
            <h2 className='text-xl font-semibold text-stone-900'>
              Edit tribe: {editingDraft.name}{' '}
              <span className='font-mono text-base font-normal text-stone-500'>({editingDraft.externalId})</span>
            </h2>
            <AdminButton variant='secondary' icon={X} className='px-3 py-1.5 text-sm' onClick={closeEditor}>
              Close
            </AdminButton>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <AdminFormField
              label='External ID'
              hint='Changing this impacts merge scripts—keep aligned with seeded graph JSON identifiers.'
              id='edit-tr-external'
            >
              <input
                id='edit-tr-external'
                className={adminInputClass}
                value={editingDraft.externalId}
                onChange={e => setEditingDraft(d => (d ? { ...d, externalId: e.target.value } : d))}
              />
            </AdminFormField>
            <AdminFormField label='Display name' hint='Label shown across maps and legends.' id='edit-tr-name'>
              <input
                id='edit-tr-name'
                className={adminInputClass}
                value={editingDraft.name}
                onChange={e => setEditingDraft(d => (d ? { ...d, name: e.target.value } : d))}
              />
            </AdminFormField>
            <AdminFormField label='Alliance group' hint='Color / cluster grouping inside graph visualizations.' id='edit-tr-group'>
              <input
                id='edit-tr-group'
                className={adminInputClass}
                value={editingDraft.group}
                onChange={e => setEditingDraft(d => (d ? { ...d, group: e.target.value } : d))}
              />
            </AdminFormField>
            <AdminFormField label='Phase' hint='Meccan vs Medinan dataset filter key.' id='edit-tr-phase'>
              <input
                id='edit-tr-phase'
                className={adminInputClass}
                value={editingDraft.phase}
                onChange={e => setEditingDraft(d => (d ? { ...d, phase: e.target.value } : d))}
              />
            </AdminFormField>
            <AdminFormField label='Layout X' hint='Graph layout planar coordinate.' id='edit-tr-x'>
              <input
                id='edit-tr-x'
                className={adminInputClass}
                type='number'
                value={editingDraft.x}
                onChange={e => setEditingDraft(d => (d ? { ...d, x: Number(e.target.value) } : d))}
              />
            </AdminFormField>
            <AdminFormField label='Layout Y' hint='Graph layout planar coordinate paired with X.' id='edit-tr-y'>
              <input
                id='edit-tr-y'
                className={adminInputClass}
                type='number'
                value={editingDraft.y}
                onChange={e => setEditingDraft(d => (d ? { ...d, y: Number(e.target.value) } : d))}
              />
            </AdminFormField>
            <AdminFormField label='Latitude' hint='WGS84 decimal degrees for map pins.' id='edit-tr-lat'>
              <input
                id='edit-tr-lat'
                className={adminInputClass}
                type='number'
                step='any'
                value={editingDraft.lat}
                onChange={e => setEditingDraft(d => (d ? { ...d, lat: Number(e.target.value) } : d))}
              />
            </AdminFormField>
            <AdminFormField label='Longitude' hint='WGS84 decimal degrees for map pins.' id='edit-tr-lon'>
              <input
                id='edit-tr-lon'
                className={adminInputClass}
                type='number'
                step='any'
                value={editingDraft.lon}
                onChange={e => setEditingDraft(d => (d ? { ...d, lon: Number(e.target.value) } : d))}
              />
            </AdminFormField>
          </div>

          <div className='mt-5 flex flex-wrap gap-3'>
            <AdminButton variant='primary' icon={Save} loading={saving} onClick={() => void saveEdit()}>
              Save changes
            </AdminButton>
            <AdminButton variant='secondary' icon={X} onClick={closeEditor}>
              Cancel
            </AdminButton>
          </div>
        </div>
      )}
    </div>
  );
}
