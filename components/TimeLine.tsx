'use client';

import Link from 'next/link';
import { EVENTS } from '@/data';

export default function Timeline() {
  return (
    <div className='grid gap-6 md:grid-cols-2'>
      {EVENTS.map((ev, index) => (
        <Link
          key={ev.slug}
          href={ev.href as any}
          className={`group relative timeline-card card p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] fade-in-up stagger-${index + 1}`}
        >
          {/* Status Badge */}
          <span
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
              ev.status === 'Live'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {ev.status}
          </span>

          {/* Era and Location */}
          <div className='mb-3 flex items-center gap-2'>
            <span className='text-xs uppercase tracking-wide text-stone-500 font-medium'>
              {ev.era}
            </span>
            <span className='text-stone-300'>•</span>
            <span className='text-xs text-stone-600'>{ev.location}</span>
          </div>

          {/* Title */}
          <h3 className='text-xl font-serif font-bold text-stone-900 mb-3 group-hover:text-amber-700 transition-colors duration-300'>
            {ev.title}
          </h3>

          {/* Summary */}
          <p className='text-stone-700 leading-relaxed mb-4 line-clamp-3'>
            {ev.summary}
          </p>

          {/* Explore Button */}
          <div className='flex items-center text-amber-600 font-medium text-sm group-hover:text-amber-700 transition-colors duration-300'>
            <span>Explore Event</span>
            <svg
              className='ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </div>

          {/* Decorative corner element */}
          <div className='absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-br from-amber-200/30 to-emerald-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        </Link>
      ))}
    </div>
  );
}

/* TODO(back-end):
   - Replace import from '@/data/events' with a server component
     that fetches from /api/events (DB) and passes data as props.
   - Add ISR or streaming for large lists.
*/
