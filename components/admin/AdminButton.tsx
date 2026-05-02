'use client';

import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-[transform,box-shadow,background,color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]';

const variants: Record<'primary' | 'secondary' | 'danger' | 'ghost', string> = {
  primary:
    'border border-amber-800/80 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-amber-50 hover:from-stone-800 hover:to-stone-950 focus-visible:outline-amber-500/70',
  secondary:
    'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 hover:border-stone-400 focus-visible:outline-stone-400',
  danger:
    'border border-rose-200 bg-gradient-to-b from-rose-50 to-rose-100/90 text-rose-900 hover:from-rose-100 hover:to-rose-100 focus-visible:outline-rose-400',
  ghost:
    'border border-transparent bg-transparent text-stone-700 shadow-none hover:bg-stone-100 focus-visible:outline-stone-400',
};

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  variant?: keyof typeof variants;
  icon?: LucideIcon;
  loading?: boolean;
  buttonType?: 'button' | 'submit' | 'reset';
};

export function AdminButton({
  variant = 'primary',
  icon: Icon,
  loading,
  children,
  className = '',
  disabled,
  buttonType = 'button',
  ...rest
}: Props) {
  return (
    <button
      type={buttonType}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 className='size-4 shrink-0 animate-spin' strokeWidth={2.5} />
      ) : Icon ? (
        <Icon className='size-4 shrink-0' strokeWidth={2} />
      ) : null}
      {children}
    </button>
  );
}
