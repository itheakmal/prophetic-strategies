'use client';
import React from 'react';
import type { MediaItem } from './MediaCarousel';

export default function SidebarGallery({
  items,
  currentIndex,
  onSelect,
}: {
  items: MediaItem[];
  currentIndex: number;
  onSelect: (i: number) => void;
}) {
  if (!items?.length) return null;
  return (
    <div className='rounded-2xl border border-stone-200 bg-white p-3 shadow-sm'>
      <h4 className='mb-2 font-semibold'>Media</h4>
      <div className='grid max-h-64 grid-cols-3 gap-2 overflow-auto'>
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`relative aspect-square overflow-hidden rounded-lg ring-1 ${i === currentIndex ? 'ring-amber-500' : 'ring-stone-200'}`}
            aria-label={`Select media ${i + 1}`}
          >
            {it.type === 'video' ? (
              <div className='absolute inset-0'>
                {it.poster ? (
                  <img
                    src={it.poster}
                    alt={it.alt || 'video'}
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center bg-black/40 text-xs text-white'>
                    VIDEO
                  </div>
                )}
              </div>
            ) : (
              <img
                src={it.src}
                alt={it.alt || ''}
                className='h-full w-full object-cover'
                loading='lazy'
              />
            )}
            <span className='pointer-events-none absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[10px] text-white'>
              {i + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
