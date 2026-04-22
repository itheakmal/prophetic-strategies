import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin';

export default async function AdminIndexPage() {
  const session = await getAdminSession();
  redirect(session ? '/admin/overview' : '/admin/login');
}
