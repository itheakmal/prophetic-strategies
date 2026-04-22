'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/admin/overview', label: 'Overview' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/tribes', label: 'Tribes' },
  { href: '/admin/contacts', label: 'Contacts' },
  { href: '/admin/users', label: 'Users' },
] as const;

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className='mb-8 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-wrap gap-2'>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === href ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className='flex items-center gap-2'>
        <Link href='/' className='text-sm text-stone-500 hover:text-stone-800'>
          ← Public site
        </Link>
        <button
          type='button'
          onClick={() => void logout()}
          className='rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100'
        >
          Log out
        </button>
      </div>
    </div>
  );
}
