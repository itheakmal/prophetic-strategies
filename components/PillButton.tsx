'use client'
import React from 'react'

export default function PillButton({ children, onClick, selected, ariaLabel }:{ children: React.ReactNode; onClick: ()=>void; selected?: boolean; ariaLabel?: string; }){
  return (
    <button aria-label={ariaLabel} onClick={onClick}
      className={`group relative w-full rounded-2xl border p-5 text-left transition-transform duration-150 md:w-auto md:min-w-[220px] ${
        selected ? "border-amber-500 bg-amber-50 shadow-md" : "border-stone-200 bg-white hover:-translate-y-0.5 hover:shadow"
      }`}>
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-50/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="relative block text-base font-semibold text-stone-800">{children}</span>
    </button>
  )
}
