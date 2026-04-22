import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminSecureLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
