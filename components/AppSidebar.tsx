'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import SidebarGallery from './SidebarGallery';
import Details from './Details';
import { useEvents, useEventActions } from '@/contexts/EventsContext';
import { EventCard, EventDetail, fetchEventCards, fetchEventDetail } from '@/lib/api/public';

export default function AppSidebar() {
  const { state } = useEvents();
  const { setMediaIndex } = useEventActions();
  const [eventCards, setEventCards] = useState<EventCard[]>([]);
  const [currentEvent, setCurrentEvent] = useState<EventDetail | null>(null);

  useEffect(() => {
    fetchEventCards().then(setEventCards).catch(() => setEventCards([]));
  }, []);

  useEffect(() => {
    fetchEventDetail(state.currentEventId).then(setCurrentEvent).catch(() => setCurrentEvent(null));
  }, [state.currentEventId]);

  const deeperItems = useMemo(() => currentEvent?.deeper ?? [], [currentEvent]);

  return (
    <aside className='card p-6'>
      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full'></div>
          <h3 className='text-lg font-serif font-bold text-stone-900'>Related</h3>
        </div>
        <div className='space-y-3'>
          {currentEvent && currentEvent.media.length > 0 && (
            <SidebarGallery items={currentEvent.media as any} currentIndex={state.mediaIndex} onSelect={setMediaIndex} />
          )}
          {deeperItems.length > 0 &&
            deeperItems.map((item, index) => {
              const [summary, detail] = item.split(':');
              return (
                <Details key={index} summary={summary || 'Details'}>
                  {detail ?? item}
                </Details>
              );
            })}
        </div>
      </div>

      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full'></div>
          <h3 className='text-lg font-serif font-bold text-stone-900'>Quick Links</h3>
        </div>
        <ul className='space-y-3'>
          {eventCards.map(event => (
            <li key={event.slug}>
              <Link
                className={`group block rounded-xl p-4 transition-all duration-300 ${
                  event.status === 'Live'
                    ? 'bg-gradient-to-br from-stone-50 to-stone-100/50 hover:from-amber-50 hover:to-amber-100/50 hover:shadow-md hover:-translate-y-1 border border-stone-200 hover:border-amber-300'
                    : 'bg-stone-100/50 text-stone-400 cursor-not-allowed border border-stone-200'
                }`}
                href={event.status === 'Live' ? (event.href as any) : '#'}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='font-medium text-stone-800 group-hover:text-amber-800 transition-colors duration-300'>
                      {event.title}
                    </div>
                    <div className='text-xs text-stone-500 mt-1'>
                      {event.location} • {event.era}
                    </div>
                  </div>
                  {event.status === 'Live' ? <div className='w-2 h-2 bg-emerald-500 rounded-full'></div> : <div className='text-xs text-stone-400'>Soon</div>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
