import Link from 'next/link';

export default function AdminOverviewPage() {
  return (
    <div className='space-y-6'>
      <h1 className='font-serif text-3xl font-bold text-stone-900'>Dashboard</h1>
      <p className='text-stone-600'>
        Manage content and contact submissions. APIs live under{' '}
        <code className='rounded bg-stone-100 px-1 text-sm'>/api/admin/*</code>.
      </p>
      <div className='grid gap-4 sm:grid-cols-3'>
        <Link
          href='/admin/events'
          className='rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300'
        >
          <h2 className='font-semibold text-stone-900'>Events</h2>
          <p className='mt-1 text-sm text-stone-600'>List and inspect timeline events.</p>
        </Link>
        <Link
          href='/admin/tribes'
          className='rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300'
        >
          <h2 className='font-semibold text-stone-900'>Tribes</h2>
          <p className='mt-1 text-sm text-stone-600'>Tribe nodes for maps and graphs.</p>
        </Link>
        <Link
          href='/admin/contacts'
          className='rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300'
        >
          <h2 className='font-semibold text-stone-900'>Contacts</h2>
          <p className='mt-1 text-sm text-stone-600'>Inbound messages from the site.</p>
        </Link>
      </div>
    </div>
  );
}
