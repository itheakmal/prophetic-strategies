'use client';

import { CircleHelp } from 'lucide-react';

/** Column header label with hover tooltip explaining the underlying field */
export default function AdminTableColumnHint({
  label,
  hint,
  className = '',
}: {
  label: string;
  hint: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium tracking-tight ${className}`}>
      {label}
      <span className='group/th relative inline-flex shrink-0 align-middle' title={hint}>
        <CircleHelp
          className='size-3.5 cursor-help text-stone-400 hover:text-amber-600'
          aria-label={`${label}: ${hint}`}
          strokeWidth={2}
        />
        <span
          role='tooltip'
          className='pointer-events-none invisible absolute bottom-full left-1/2 z-[80] mb-2 w-max max-w-[min(240px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-stone-700/25 bg-stone-900 px-2.5 py-2 text-left text-[10px] font-normal uppercase leading-snug tracking-wide text-stone-100 opacity-0 shadow-xl ring-1 ring-white/10 transition-all duration-150 group-hover/th:visible group-hover/th:opacity-100'
        >
          {hint}
        </span>
      </span>
    </span>
  );
}
