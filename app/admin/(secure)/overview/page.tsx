import { ArrowRight, CalendarDays, LayoutDashboard, Mail, Network, UsersRound } from 'lucide-react';
import Link from 'next/link';

const cards = [
  {
    href: '/admin/events',
    icon: CalendarDays,
    title: 'Events',
    description: 'Author timeline narratives, reflections hooks, quotes, media, and follow-up exercises.',
    cta: 'Open events',
  },
  {
    href: '/admin/tribes',
    icon: Network,
    title: 'Tribes',
    description: 'Curate Quraysh-era factions, coordinates for maps, and graph metadata powering /tribes.',
    cta: 'Manage tribes',
  },
  {
    href: '/admin/contacts',
    icon: Mail,
    title: 'Contacts',
    description: 'Review inbound enquiries with timestamps to triage support or partnerships.',
    cta: 'View submissions',
  },
  {
    href: '/admin/users',
    icon: UsersRound,
    title: 'Users',
    description: 'Provision editors and admins tied to authenticated portal sessions.',
    cta: 'Manage users',
  },
] as const;

export default function AdminOverviewPage() {
  return (
    <div className='space-y-8'>
      <div className='flex flex-wrap items-start gap-4'>
        <span className='flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 text-white shadow-lg'>
          <LayoutDashboard className='size-6' strokeWidth={2} aria-hidden />
        </span>
        <div>
          <h1 className='font-serif text-3xl font-bold text-stone-900'>Mission control</h1>
          <p className='mt-1 max-w-2xl text-stone-600'>
            Authenticated tooling for curriculum operators. Prefer HTTPS in production so admin cookies remain scoped to{' '}
            <code className='rounded bg-stone-100 px-1 text-sm'>HttpOnly</code> sessions tied to `/api/admin/*`.
          </p>
        </div>
      </div>

      <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
        {cards.map(({ href, icon: Icon, title, description, cta }) => (
          <Link
            key={href}
            href={href}
            className='group flex h-full cursor-pointer flex-col rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/70 p-6 shadow-md transition-all hover:border-amber-300/70 hover:shadow-xl active:scale-[0.99]'
          >
            <Icon className='size-8 text-amber-800 transition-transform group-hover:scale-105' strokeWidth={1.75} aria-hidden />
            <h2 className='mt-4 font-semibold text-stone-900'>{title}</h2>
            <p className='mt-2 flex-1 text-sm leading-relaxed text-stone-600'>{description}</p>
            <span className='mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-900'>
              {cta}
              <ArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' strokeWidth={2} aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
