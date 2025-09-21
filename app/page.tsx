'use client';

import Timeline from '@/components/TimeLine';

export default function LandingPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-serif font-semibold text-stone-900">Seerah — Event Explorer</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-700">
          Start with the timeline below. Click an event card to dive into context, media, and reflective prompts.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-stone-900">Timeline</h2>
        <Timeline />
      </section>
    </main>
  );
}
