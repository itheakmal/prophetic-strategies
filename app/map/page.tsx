'use client';

import { useEffect, useState } from 'react';
import Section from '@/components/Section';
import ArabiaMap from '@/components/ArabiaMap';
import { fetchTribesGraph } from '@/lib/api/public';

export default function ArabiaMapPage() {
  const [graph, setGraph] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });

  useEffect(() => {
    fetchTribesGraph('meccan').then(setGraph).catch(() => setGraph({ nodes: [], links: [] }));
  }, []);

  return (
    <main className='space-y-6'>
      <Section title='Arabia Map — Meccan Interactions' subtitle='Pan/zoom. Click a tribe to see chiefs, elders, and citations.'>
        <ArabiaMap nodes={graph.nodes as any} links={graph.links as any} />
      </Section>
    </main>
  );
}
