'use client';

import Section from '@/components/Section';
import ArabiaMap from '@/components/ArabiaMap';
import { TRIBE_NODES, TRIBE_LINKS } from '@/data/tribes';

export default function ArabiaMapPage() {
  return (
    <main className="space-y-6">
      <Section title="Arabia Map — Meccan Interactions" subtitle="Pan/zoom. Click a tribe to see chiefs, elders, and citations.">
        <ArabiaMap nodes={TRIBE_NODES} links={TRIBE_LINKS} />
      </Section>

      <Section title="Extend later" subtitle="How to add more tribes & connections">
        <ol className="list-decimal pl-5 text-sm text-stone-700">
          <li>Add a node in <code>data/tribes.ts</code> with <b>lat</b>/<b>lon</b> and any <b>chiefs</b>, <b>elders</b>, <b>refs</b>.</li>
          <li>Add a link in <code>TRIBE_LINKS</code> with <code>kind: 'alliance' | 'war'</code> and optional <code>note</code>.</li>
          <li>Reload the page — the map updates automatically.</li>
        </ol>
        {/* TODO(back-end): Replace static import with GET /api/tribes?phase=meccan and pass into <ArabiaMap/> */}
      </Section>
    </main>
  );
}
