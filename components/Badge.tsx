'use client'
export default function Badge({ children }:{ children: React.ReactNode }){
  return (
    <span className="inline-flex items-center gap-2 rounded-full border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-2 text-sm font-bold text-amber-800 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
      {children}
    </span>
  )
}
