'use client';

import { CircleHelp } from 'lucide-react';

type Props = {
  id?: string;
  label: string;
  hint: string;
  children: React.ReactNode;
  className?: string;
};

/** Label + contextual hint tooltip (hover the help icon). */
export default function AdminFormField({ id, label, hint, children, className }: Props) {
  return (
    <div className={className}>
      <div className='mb-1.5 flex items-start gap-1.5'>
        <label htmlFor={id} className='cursor-default pt-px text-sm font-semibold tracking-tight text-stone-800'>
          {label}
        </label>
        <span className='group/tip relative inline-flex shrink-0' title={hint}>
          <CircleHelp
            className='mt-0.5 size-4 cursor-help text-stone-400 transition-colors hover:text-amber-600'
            aria-label={`About ${label}`}
            strokeWidth={2}
          />
          <span
            role='tooltip'
            className='pointer-events-none invisible absolute bottom-full left-1/2 z-[100] mb-2 block w-max max-w-[min(260px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-stone-700/25 bg-gradient-to-br from-stone-900 to-stone-800 px-3 py-2 text-left text-[11px] font-normal leading-relaxed tracking-wide text-stone-100 opacity-0 shadow-xl ring-1 ring-white/10 transition-all duration-150 group-hover/tip:visible group-hover/tip:opacity-100 md:left-full md:right-auto md:top-1/2 md:bottom-auto md:mb-0 md:ml-2 md:w-56 md:-translate-y-1/2 md:translate-x-0'
          >
            {hint}
          </span>
        </span>
      </div>
      {children}
    </div>
  );
}
