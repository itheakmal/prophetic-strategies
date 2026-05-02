'use client';

interface SocialLoginButtonsProps {
  returnTo: string;
}

const providers = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'apple', label: 'Continue with Apple' },
  { id: 'facebook', label: 'Continue with Facebook' },
] as const;

export default function SocialLoginButtons({ returnTo }: SocialLoginButtonsProps) {
  return (
    <div className='space-y-2'>
      {providers.map(provider => (
        <a
          key={provider.id}
          href={`/api/auth/oauth/${provider.id}/start?returnTo=${encodeURIComponent(returnTo)}`}
          className='flex w-full items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50'
        >
          {provider.label}
        </a>
      ))}
    </div>
  );
}
