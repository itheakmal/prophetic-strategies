'use client'
import React from 'react'

export default function Details({ summary, children }:{ summary:string; children: React.ReactNode }){
  return (
    <details className="group rounded-xl border border-stone-200 bg-white p-4 open:bg-stone-50">
      <summary className="cursor-pointer list-none font-medium text-stone-800">
        <span className="mr-2">📜</span>{summary}
      </summary>
      <div className="mt-3 text-sm leading-6 text-stone-700">{children}</div>
    </details>
  )
}
