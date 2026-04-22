import { redirect } from 'next/navigation';
import { db } from '@/lib/db/client';
import { getUserSession } from '@/lib/auth/user';
import ProfileActions from '@/components/auth/ProfileActions';

export default async function ProfilePage() {
  const session = await getUserSession();
  if (!session) {
    redirect('/login');
  }

  const user = await db.user.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <main className='mx-auto max-w-2xl space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm'>
      <h1 className='font-serif text-3xl font-bold text-stone-900'>Profile</h1>
      <div className='grid gap-3 text-sm text-stone-700'>
        <p><span className='font-medium'>Name:</span> {user.name ?? '-'}</p>
        <p><span className='font-medium'>Email:</span> {user.email}</p>
        <p><span className='font-medium'>Role:</span> {user.role}</p>
        <p><span className='font-medium'>Joined:</span> {new Date(user.createdAt).toLocaleString()}</p>
      </div>
      <ProfileActions />
    </main>
  );
}
