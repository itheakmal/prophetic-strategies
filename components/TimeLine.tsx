'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EventCard, fetchEventCards } from '@/lib/api/public';

export default function Timeline() {
  const [events, setEvents] = useState<EventCard[]>([]);

  useEffect(() => {
    fetchEventCards().then(setEvents).catch(() => setEvents([]));
  }, []);

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      {events.map((ev, index) => (
        <Link
          key={ev.slug}
          href={ev.href as any}
          className={`group relative timeline-card card p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] fade-in-up stagger-${index + 1}`}
        >
          <span
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
              ev.status === 'Live'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {ev.status}
          </span>
          <div className='mb-3 flex items-center gap-2'>
            <span className='text-xs uppercase tracking-wide text-stone-500 font-medium'>
              {ev.era}
            </span>
            <span className='text-stone-300'>•</span>
            <span className='text-xs text-stone-600'>{ev.location}</span>
          </div>
          <h3 className='text-xl font-serif font-bold text-stone-900 mb-3 group-hover:text-amber-700 transition-colors duration-300'>
            {ev.title}
          </h3>
          <p className='text-stone-700 leading-relaxed mb-4 line-clamp-3'>{ev.summary}</p>
          <div className='flex items-center text-amber-600 font-medium text-sm group-hover:text-amber-700 transition-colors duration-300'>
            <span>Explore Event</span>
          </div>
          <div className='absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-br from-amber-200/30 to-emerald-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        </Link>
      ))}
    </div>
  );
}
