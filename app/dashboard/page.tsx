import Link from 'next/link';
import ProgressBar from '@/components/ProgressBar';
import Badge from '@/components/Badge';
import { getDashboardStatsForUser } from '@/lib/services/dashboard-stats-service';
import { getUserSession } from '@/lib/auth/user';

export default async function DashboardPage() {
  const session = await getUserSession();
  if (!session) {
    return null;
  }

  const stats = await getDashboardStatsForUser(session.sub);

  return (
    <main className='space-y-8'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='font-serif text-3xl font-bold text-stone-900'>Dashboard</h1>
          <p className='mt-1 text-sm text-stone-600'>
            Track reflections, homework, and community activity in one place.
          </p>
        </div>
        <Link
          href='/dashboard/upload'
          className='rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-stone-800'
        >
          Upload homework
        </Link>
      </div>

      <section className='card rounded-2xl border border-stone-200 bg-white p-6 shadow-sm'>
        <div className='mb-2 flex items-center justify-between gap-2'>
          <h2 className='text-lg font-semibold text-stone-900'>Journey progress</h2>
          <span className='text-sm text-stone-500'>{stats.progressPct}%</span>
        </div>
        <ProgressBar value={stats.progressPct} />
        <p className='mt-2 text-xs text-stone-500'>
          Based on reflections, homework submissions, and comments (caps at 100%).
        </p>
      </section>

      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[
          ['Reflections saved', stats.reflectionCount],
          ['Homework uploads', stats.homeworkCount],
          ['Comments posted', stats.commentCount],
          ['Pieces pinned', stats.pinnedCount],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className='card rounded-xl border border-stone-200 bg-white p-4 shadow-sm'
          >
            <p className='text-xs font-medium uppercase tracking-wide text-stone-500'>{label}</p>
            <p className='mt-1 text-2xl font-semibold tabular-nums text-stone-900'>{value}</p>
          </div>
        ))}
      </section>

      <section className='card rounded-2xl border border-stone-200 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-semibold text-stone-900'>Achievements</h2>
        <p className='mt-1 text-sm text-stone-600'>Highlights unlocked as you learn with the cohort.</p>
        <div className='mt-4 flex flex-wrap gap-2'>
          {stats.achievements.length === 0 ? (
            <p className='text-sm text-stone-500'>Keep going—your first badge is close.</p>
          ) : (
            stats.achievements.map(b => (
              <span key={b.id} title={b.description}>
                <Badge>{b.label}</Badge>
              </span>
            ))
          )}
        </div>
      </section>

      <section className='flex flex-wrap gap-4'>
        <Link
          href='/homework'
          className='rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50'
        >
          Open homework feed
        </Link>
        <Link href='/profile' className='rounded-xl px-5 py-3 text-sm font-medium text-amber-800 hover:bg-amber-50'>
          Profile
        </Link>
      </section>
    </main>
  );
}
