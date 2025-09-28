'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className='mb-8 card p-6'>
      <div className='flex items-center justify-between'>
        <Link
          href='/'
          className='text-2xl font-serif font-bold text-stone-900 hover:text-amber-600 transition-colors duration-300'
        >
          Seerah
          <span className='block text-sm font-normal text-stone-600'>
            Sacred Journey
          </span>
        </Link>
        <nav className='flex items-center gap-1 text-sm'>
          <Link
            href='/'
            className='rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
          >
            Home
          </Link>
          <Link
            href='/importance'
            className='rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
          >
            Why Seerah?
          </Link>
          <Link
            href='/tribes'
            className='rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
          >
            Tribes
          </Link>
          <Link
            href='/map'
            className='rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
          >
            Map
          </Link>
        </nav>
      </div>
    </header>
  );
}
