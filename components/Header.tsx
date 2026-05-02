import { getUserSession } from '@/lib/auth/user';
import SiteHeader from '@/components/SiteHeader';

export default async function Header() {
  const session = await getUserSession();
  return <SiteHeader session={session ? { email: session.email } : null} />;
}
