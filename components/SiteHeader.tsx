'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Props = {
  session: { email: string } | null;
};

export default function SiteHeader({ session }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
    router.push('/');
    setOpen(false);
  }

  const initial = session?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className='relative isolate z-[1000] mb-8 card p-6 shadow-sm'>
      <div className='flex items-center justify-between gap-4'>
        <Link
          href='/'
          className='text-2xl font-serif font-bold text-stone-900 hover:text-amber-600 transition-colors duration-300'
        >
          Seerah
          <span className='block text-sm font-normal text-stone-600'>Sacred Journey</span>
        </Link>
        <nav className='flex flex-wrap items-center justify-end gap-1 text-sm'>
          <Link
            href='/'
            className='cursor-pointer rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
          >
            Home
          </Link>
          <Link
            href='/importance'
            className='cursor-pointer rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
          >
            Why Seerah?
          </Link>
          <Link
            href='/tribes'
            className='cursor-pointer rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
          >
            Tribes
          </Link>
          <Link
            href='/map'
            className='cursor-pointer rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
          >
            Map
          </Link>
          <Link
            href='/contact'
            className='cursor-pointer rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
          >
            Contact
          </Link>

          {session ? (
            <>
              <Link
                href='/homework'
                className='cursor-pointer rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
              >
                Homework
              </Link>
              <div className='relative z-[1100]' ref={menuRef}>
                <button
                  type='button'
                  aria-expanded={open}
                  aria-haspopup='true'
                  onClick={() => setOpen(o => !o)}
                  className='ml-1 flex cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-1 py-1 pl-2 pr-3 text-sm font-medium text-stone-800 shadow-sm hover:border-amber-200 hover:bg-amber-50/40'
                >
                  <span className='flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold'>
                    {initial}
                  </span>
                  Account
                  <svg className='h-4 w-4 text-stone-500' viewBox='0 0 20 20' fill='currentColor' aria-hidden>
                    <path d='M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.08 1.04l-4.24 5a.75.75 0 01-1.08 0l-4.24-5a.75.75 0 01.02-1.06z' />
                  </svg>
                </button>
                {open ? (
                  <div className='absolute right-0 z-[1200] mt-2 w-52 rounded-xl border border-stone-200 bg-white py-1 shadow-xl ring-1 ring-black/5'>
                    <Link
                      href='/profile'
                      className='block cursor-pointer px-4 py-2 text-stone-700 hover:bg-stone-50'
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href='/dashboard'
                      className='block cursor-pointer px-4 py-2 text-stone-700 hover:bg-stone-50'
                      onClick={() => setOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href='/dashboard/upload'
                      className='block cursor-pointer px-4 py-2 text-stone-700 hover:bg-stone-50'
                      onClick={() => setOpen(false)}
                    >
                      Upload homework
                    </Link>
                    <button
                      type='button'
                      className='w-full cursor-pointer px-4 py-2 text-left text-red-700 hover:bg-red-50'
                      onClick={() => logout()}
                    >
                      Log out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <Link
              href='/login'
              className='cursor-pointer rounded-lg px-4 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 font-medium'
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
