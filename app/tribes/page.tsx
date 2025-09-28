'use client';

import Section from '@/components/Section';
import TribeGraph from '@/components/TribeGraph';
import { TRIBE_NODES, TRIBE_LINKS } from '@/data/tribes';

export default function TribesPage() {
  return (
    <main className='space-y-6'>
      <Section
        title='Pre-Islamic Tribes (Meccan phase)'
        subtitle='Zoom & pan. Hover for tooltips; click a node for citations.'
      >
        <TribeGraph nodes={TRIBE_NODES} links={TRIBE_LINKS} />
      </Section>

      <Section title='About this diagram' subtitle='How to interpret'>
        <ul className='list-disc pl-5 text-sm text-stone-700'>
          <li>
            Colors indicate blocs:{' '}
            <span className='font-medium'>Hilf al-Fudul</span>,{' '}
            <span className='font-medium'>Ahlaf</span>, and{' '}
            <span className='font-medium'>External contacts</span>.
          </li>
          <li>
            Arrowed lines hint direction of interaction (e.g., outreach during
            Ḥajj seasons).
          </li>
          <li>
            Click a node to view its citations (replace with references later).
          </li>
        </ul>
        {/* TODO(back-end): Replace TRIBE_NODES/TRIBE_LINKS with SSR data from /api/tribes?phase=meccan */}
      </Section>
    </main>
  );
}
