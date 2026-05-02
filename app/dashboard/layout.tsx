import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth/user';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent('/dashboard')}`);
  }
  return <>{children}</>;
}
