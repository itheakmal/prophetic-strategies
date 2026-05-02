'use client';

import {
  ArrowLeft,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Mail,
  Network,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/AdminButton';

const links = [
  { href: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: CalendarDays },
  { href: '/admin/tribes', label: 'Tribes', icon: Network },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/users', label: 'Users', icon: UsersRound },
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
    <div className='relative z-20 mb-8 flex flex-col gap-4 rounded-2xl border border-stone-200/90 bg-gradient-to-r from-stone-50 via-white to-amber-50/30 p-4 shadow-md ring-1 ring-stone-100 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-wrap gap-2'>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold shadow-sm transition-all active:scale-[0.98] ${
                active
                  ? 'bg-gradient-to-b from-stone-900 to-stone-950 text-amber-50 ring-1 ring-stone-800/40'
                  : 'border border-stone-200 bg-white text-stone-800 hover:border-amber-200 hover:bg-amber-50/40'
              }`}
            >
              <Icon className='size-4 shrink-0 opacity-90' strokeWidth={2} aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Link
          href='/'
          className='inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-colors hover:bg-stone-50'
        >
          <ArrowLeft className='size-4' strokeWidth={2} aria-hidden /> Public site
        </Link>
        <AdminButton variant='secondary' icon={LogOut} className='px-4 py-2' onClick={() => void logout()}>
          Log out
        </AdminButton>
      </div>
    </div>
  );
}
