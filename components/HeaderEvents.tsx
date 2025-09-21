import React from 'react'
import ProgressBar from './ProgressBar'
import { EVENT } from '@/data/event'
import { useEventProgress } from '@/contexts/EventsContext'

export default function HeaderEvents() {
  const { progress } = useEventProgress()
  
  return (
   <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold tracking-tight text-stone-900">{EVENT.title}</h1>
        <p className="mt-1 text-sm text-stone-600">{EVENT.location} • {EVENT.era}</p>
        </div>
        <div className="w-48">
          <ProgressBar value={progress} />
          <p className="mt-1 text-right text-xs text-stone-500">{progress}% complete</p>
        </div>
      </header>
  )
}