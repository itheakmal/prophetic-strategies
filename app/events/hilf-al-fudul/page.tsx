'use client'

import React from 'react'
import Section from '@/components/Section'
import ProgressBar from '@/components/ProgressBar'
import Badge from '@/components/Badge'
import PillButton from '@/components/PillButton'
import Details from '@/components/Details'
import MediaCarousel from '@/components/MediaCarousel'
import SidebarGallery from '@/components/SidebarGallery'
import { EVENT } from '@/data/event'
import { useEvents, useEventProgress, useEventActions } from '@/contexts/EventsContext'

export default function Page(){
  const { state } = useEvents()
  const { progress, badges } = useEventProgress()
  const { 
    setChoice, 
    setAnswerIndex, 
    setAnswerChecked, 
    setThinkDeeper, 
    setJournal, 
    setSavedAt, 
    setMediaIndex, 
    resetEventState 
  } = useEventActions()


  function currentFollowup(){
    if (!state.choice) return null
    return (EVENT.followups as any)[state.choice]
  }
  function isAnswerCorrect(){
    const f = currentFollowup() as any
    if (!f || typeof state.answerIndex !== 'number') return false
    return state.answerIndex === f.correctIndex
  }
  function handleSave(){ setSavedAt(new Date().toLocaleString()) }
  async function handleShare(){
    const text = `My reflection on ${EVENT.title}:\n\n${state.journal || '(no reflection yet)'}`
    const url = window.location.href
    const shareData = { title: EVENT.title, text, url } as any
    try {
      if (navigator.share) { await navigator.share(shareData) }
      else { await navigator.clipboard.writeText(`${text}\n${url}`); alert('Copied reflection + link to clipboard!') }
    } catch {}
  }
  function resetAll(){
    resetEventState()
  }

  return (
    <div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {badges.map((b,i) => <Badge key={i}>🏅 {b}</Badge>)}
        </div>
      )}

      {/* 1) Event Presentation */}
      <Section title="Event Presentation" subtitle="Context, visuals, and a key quote">
        {/* <div className="grid gap-5 md:grid-cols-3"> */}
          <div className="space-y-5">
            {EVENT.media && EVENT.media.length > 0 && (
              <MediaCarousel items={EVENT.media as any} index={state.mediaIndex} onChange={setMediaIndex} />
            )}
            <div className="card p-5">
              <h3 className="mb-2 text-lg font-semibold">Context</h3>
              <p className="leading-7 text-stone-700">{EVENT.context}</p>
              <div className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-900">
                <p className="italic">“{EVENT.quote.text}”</p>
                <p className="mt-1 text-xs opacity-75">Source: {EVENT.quote.source}</p>
              </div>
            </div>
          </div>
          {/* <div className="space-y-3">
            {EVENT.media && EVENT.media.length > 0 && (
              <SidebarGallery items={EVENT.media as any} currentIndex={mediaIndex} onSelect={setMediaIndex} />
            )}
            <Details summary="Social conditions in Makkah">{EVENT.deeper[0]}</Details>
            <Details summary="Tribal dynamics">{EVENT.deeper[1]}</Details>
            <Details summary="Think Deeper (scholarly notes)">
              <ul className="list-disc pl-5">
                <li>{EVENT.deeper[2]}</li>
                <li>Insert authenticated hadith/biographical references here with exact wording & citations.</li>
              </ul>
            </Details>
          </div> */}
        {/* </div> */}
      </Section>

      {/* 2) Interactive Reflection */}
      <Section title="Interactive Reflection" subtitle="Was this an action or a reaction?">
        <div className="flex flex-col gap-3 md:flex-row">
          <PillButton ariaLabel="Choose Action" onClick={() => setChoice('action')} selected={state.choice === 'action'}>✨ Action</PillButton>
          <PillButton ariaLabel="Choose Reaction" onClick={() => setChoice('reaction')} selected={state.choice === 'reaction'}>🔁 Reaction</PillButton>
        </div>
      </Section>

      {/* 3) Follow-up Question */}
      {state.choice && (
        <Section title="Follow-up Question" subtitle={state.choice === 'action' ? 'Why did he take this action?' : 'How did he respond?'}>
          <div className="card p-5">
            <p className="mb-4 text-base font-medium">{(EVENT.followups as any)[state.choice].prompt}</p>

            {((EVENT.followups as any)[state.choice].type === 'mcq') && (
              <div className="grid gap-3 md:grid-cols-2">
                {(EVENT.followups as any)[state.choice].choices.map((c:string, idx:number) => (
                  <label key={idx} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                    state.answerIndex === idx ? 'border-amber-500 bg-amber-50' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                  }`}>
                    <input type="radio" name="followup" className="mt-1" checked={state.answerIndex === idx} onChange={() => setAnswerIndex(idx)} />
                    <span className="text-stone-800">{c}</span>
                  </label>
                ))}
              </div>
            )}

            {((EVENT.followups as any)[state.choice].type === 'dropdown') && (
              <div className="max-w-md">
                <select className="w-full rounded-xl border border-stone-300 bg-white p-3 text-stone-800 focus:border-amber-500 focus:outline-none" value={state.answerIndex ?? ''} onChange={(e) => setAnswerIndex(Number(e.target.value))}>
                  <option value="" disabled>Select a reason…</option>
                  {(EVENT.followups as any)[state.choice].choices.map((c:string, idx:number) => (
                    <option key={idx} value={idx}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => setAnswerChecked(true)} disabled={state.answerIndex === null} className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                Check Answer
              </button>
              <button onClick={() => setThinkDeeper(!state.thinkDeeper)} className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100">
                {state.thinkDeeper ? 'Hide' : 'Think Deeper'}
              </button>
            </div>

            {state.answerChecked && (
              <div className={`mt-4 rounded-xl p-4 text-sm ${isAnswerCorrect() ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                <p className="font-medium">{isAnswerCorrect() ? 'Correct ✔' : "Let's revisit ✧"}</p>
                <p className="mt-1 leading-6">{(EVENT.followups as any)[state.choice].explanation}</p>
              </div>
            )}

            {state.thinkDeeper && (
              <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-800">
                <h4 className="mb-1 font-semibold">Scholarly interpretations</h4>
                <ul className="list-disc pl-5">
                  <li>Compare civil pacts vs. state law: how prophetic endorsement shapes civic virtue.</li>
                  <li>Map to maqāṣid al-sharīʿah and prophetic values (ʿadl/justice, ḥifẓ al-ḥuqūq/rights).</li>
                  <li>Insert authenticated citations from your Sessions corpus here.</li>
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* 4) Reflection & Takeaway */}
      <Section title="Reflection & Takeaway" subtitle="Lessons, modern parallels, and your journal">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <div className="card p-4 max-h-52 overflow-auto">
              <h4 className="mb-2 font-semibold">Key Lessons</h4>
              <ul className="list-disc pl-5 text-sm leading-7 text-stone-700">
                {EVENT.lessons.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </div>
            <div className="card p-4 max-h-52 overflow-auto">
              <h4 className="mb-2 font-semibold">Modern Parallels</h4>
              <ul className="list-disc pl-5 text-sm leading-7 text-stone-700">
                {EVENT.parallels.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
          <div>
            <div className="card p-4">
              <label htmlFor="journal" className="mb-2 block text-sm font-semibold">How can you apply this today?</label>
              <textarea id="journal" value={state.journal} onChange={(e)=>setJournal(e.target.value)} placeholder="e.g., Speak up for a colleague; support a local justice initiative; commit to fair dealing…" className="h-40 w-full resize-none rounded-xl border border-stone-300 p-3 text-sm text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none" />
              <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
                <span>{state.journal.length} chars</span>
                {state.savedAt && <span>Saved: {state.savedAt}</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                <button onClick={() => setSavedAt(new Date().toLocaleString())} className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">Save Insight</button>
                <button onClick={handleShare} className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100">Share</button>
                <button onClick={resetAll} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 5) Navigation & Progress */}
      <Section title="Navigation & Progress" subtitle="Track progress, earn badges, and move to the next event">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-stone-600">Progress</span>
            <div className="w-40"><ProgressBar value={progress} /></div>
            <span className="text-xs text-stone-500">{progress}%</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {badges.slice(0,3).map((b,i) => <Badge key={i}>🏅 {b}</Badge>)}
            {badges.length > 3 && <Badge>＋{badges.length - 3} more</Badge>}
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100">Previous</button>
            <button className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800">Next Event</button>
          </div>
        </div>
      </Section>

      <p className="mt-8 text-center text-xs text-stone-500">Replace placeholder texts with authenticated quotes and citations from your Sessions corpus.</p>
    </div>
  )
}
