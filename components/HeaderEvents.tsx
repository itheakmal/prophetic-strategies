import React from 'react'
import ProgressBar from './ProgressBar'
import { getEventBySlug } from '@/data/event'
import { useEvents, useEventProgress } from '@/contexts/EventsContext'

export default function HeaderEvents() {
  const { state } = useEvents()
  const { progress } = useEventProgress()
  
  const event = getEventBySlug(state.currentEventId)
  
  if (!event) {
    return null
  }
  
  return (
    <header className="relative overflow-hidden rounded-3xl hero-gradient p-8 md:p-12">
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="fade-in-up">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  {event.era}
                </span>
                <span className="text-stone-400">•</span>
                <span className="text-sm text-stone-600 font-medium">{event.location}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">
                {event.title}
              </h1>
              <p className="text-lg text-stone-700 leading-relaxed max-w-3xl">
                {event.context}
              </p>
            </div>
          </div>
          
          <div className="lg:flex-shrink-0">
            <div className="card p-6 fade-in-up stagger-1">
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-amber-600 mb-1">{progress}%</div>
                  <div className="text-sm text-stone-600 font-medium">Complete</div>
                </div>
                <ProgressBar value={progress} />
                <p className="mt-3 text-xs text-stone-500">
                  Keep exploring to unlock more insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-8 right-8 w-16 h-16 bg-amber-200/30 rounded-full floating-animation"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 bg-emerald-200/30 rounded-full floating-animation" style={{animationDelay: '2s'}}></div>
    </header>
  )
}