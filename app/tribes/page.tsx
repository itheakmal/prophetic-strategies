'use client';

import { useEffect, useState } from 'react';
import Section from '@/components/Section';
import TribeGraph from '@/components/TribeGraph';
import { fetchTribesGraph } from '@/lib/api/public';

export default function TribesPage() {
  const [graph, setGraph] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });

  useEffect(() => {
    fetchTribesGraph('meccan').then(setGraph).catch(() => setGraph({ nodes: [], links: [] }));
  }, []);

  return (
    <main className='space-y-6'>
      <Section title='Pre-Islamic Tribes (Meccan phase)' subtitle='Zoom & pan. Hover for tooltips; click a node for citations.'>
        <TribeGraph nodes={graph.nodes as any} links={graph.links as any} />
      </Section>
    </main>
  );
}
