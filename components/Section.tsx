'use client'
import React from 'react'

export default function Section({ title, subtitle, children }:{ title:string; subtitle?:string; children: React.ReactNode }){
  return (
    <section className="mb-6 rounded-2xl bg-stone-50/70 p-5 shadow-sm ring-1 ring-stone-200">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-serif text-stone-800">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
