import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth/user';

export default async function HomeworkSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent('/homework')}`);
  }
  return <>{children}</>;
}
