'use client';

import { useRouter } from 'next/navigation';

export default function ProfileActions() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/');
    router.refresh();
  }

  return (
    <button
      type='button'
      onClick={() => void logout()}
      className='rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100'
    >
      Log out
    </button>
  );
}
