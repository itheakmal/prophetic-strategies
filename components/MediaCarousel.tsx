'use client';
import React from 'react';

export type MediaItem = {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
};

export default function MediaCarousel({
  items,
  index,
  onChange,
}: {
  items: MediaItem[];
  index: number;
  onChange: (i: number) => void;
}) {
  const total = items?.length ?? 0;

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!total) return;
      if (e.key === 'ArrowRight') onChange((index + 1) % total);
      if (e.key === 'ArrowLeft') onChange((index - 1 + total) % total);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, onChange]);

  if (!total) return null;
  const item = items[index];

  return (
    <div className='group relative overflow-hidden rounded-2xl border border-stone-200 bg-black/5'>
      <div className='aspect-video w-full bg-black/40 flex items-center justify-center'>
        {item.type === 'video' ? (
          <video
            controls
            className='h-full w-full object-cover'
            poster={item.poster}
            aria-label={item.alt || 'video'}
          >
            <source src={item.src} />
          </video>
        ) : (
          <img
            src={item.src}
            alt={item.alt || ''}
            className='h-full w-full object-cover'
            loading='lazy'
          />
        )}
      </div>

      <button
        onClick={() => onChange((index - 1 + total) % total)}
        className='absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-stone-800 shadow hover:bg-white'
        aria-label='Previous'
      >
        ‹
      </button>
      <button
        onClick={() => onChange((index + 1) % total)}
        className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-stone-800 shadow hover:bg-white'
        aria-label='Next'
      >
        ›
      </button>

      <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-1'>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-amber-500' : 'bg-white/70'} ring-1 ring-stone-300`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
