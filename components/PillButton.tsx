'use client'
import React from 'react'

export default function PillButton({ children, onClick, selected, ariaLabel }:{ children: React.ReactNode; onClick: ()=>void; selected?: boolean; ariaLabel?: string; }){
  return (
    <button aria-label={ariaLabel} onClick={onClick}
      className={`group relative w-full rounded-2xl border-2 p-6 text-left transition-all duration-300 md:w-auto md:min-w-[240px] ${
        selected 
          ? "border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg scale-105" 
          : "border-stone-200 bg-white hover:-translate-y-1 hover:shadow-lg hover:border-amber-300 hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-white"
      }`}>
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-100/20 to-emerald-100/20 opacity-0 transition-opacity group-hover:opacity-100" />
      <span className={`relative block text-lg font-bold transition-colors duration-300 ${
        selected ? "text-amber-800" : "text-stone-800 group-hover:text-amber-700"
      }`}>
        {children}
      </span>
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  )
}
