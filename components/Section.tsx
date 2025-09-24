'use client'
import React from 'react'

export default function Section({ title, subtitle, children }:{ title:string; subtitle?:string; children: React.ReactNode }){
  return (
    <section className="card p-8 fade-in-up">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">{title}</h2>
        </div>
        {subtitle && (
          <p className="text-stone-600 font-medium ml-4">{subtitle}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  )
}
