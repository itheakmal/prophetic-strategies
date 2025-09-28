'use client';
export default function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className='h-2 w-full overflow-hidden rounded-full bg-stone-200'
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <div
        className='h-full bg-amber-500 transition-all'
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
