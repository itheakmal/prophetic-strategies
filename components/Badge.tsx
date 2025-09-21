'use client'
export default function Badge({ children }:{ children: React.ReactNode }){
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
      {children}
    </span>
  )
}
