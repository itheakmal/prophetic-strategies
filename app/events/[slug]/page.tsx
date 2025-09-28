'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Section from '@/components/Section';
import ProgressBar from '@/components/ProgressBar';
import Badge from '@/components/Badge';
import PillButton from '@/components/PillButton';
import Details from '@/components/Details';
import MediaCarousel from '@/components/MediaCarousel';
import SidebarGallery from '@/components/SidebarGallery';
import { getEventBySlug } from '@/data';
import {
  useEvents,
  useEventProgress,
  useEventActions,
} from '@/contexts/EventsContext';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { slug } = React.use(params);
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const { state } = useEvents();
  const { progress, badges } = useEventProgress();
  const {
    setChoice,
    setAnswerIndex,
    setAnswerChecked,
    setThinkDeeper,
    setJournal,
    setSavedAt,
    setMediaIndex,
    resetEventState,
    switchEvent,
  } = useEventActions();

  // Switch to the current event when component mounts or slug changes
  React.useEffect(() => {
    if (state.currentEventId !== slug) {
      switchEvent(slug);
    }
  }, [slug, state.currentEventId, switchEvent]);

  function currentFollowup() {
    if (!state.choice) return null;
    return event.followups[state.choice];
  }

  function isAnswerCorrect() {
    const f = currentFollowup();
    if (!f || typeof state.answerIndex !== 'number') return false;
    return state.answerIndex === f.correctIndex;
  }

  function handleSave() {
    setSavedAt(new Date().toLocaleString());
  }

  async function handleShare() {
    const text = `My reflection on ${event.title}:\n\n${state.journal || '(no reflection yet)'}`;
    const url = window.location.href;
    const shareData = { title: event.title, text, url } as any;
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        alert('Copied reflection + link to clipboard!');
      }
    } catch {}
  }

  function resetAll() {
    resetEventState();
  }

  return (
    <div className='space-y-8'>
      {/* Badges */}
      {badges.length > 0 && (
        <div className='flex flex-wrap gap-3 fade-in-up'>
          {badges.map((b, i) => (
            <Badge key={i}>🏅 {b}</Badge>
          ))}
        </div>
      )}

      {/* 1) Event Presentation */}
      <Section title='Sacred Quotes' subtitle={event.quotes[0]?.subtitle}>
        <div className='space-y-6'>
          {event.media && event.media.length > 0 && (
            <div className='fade-in-up stagger-1'>
              <MediaCarousel
                items={event.media}
                index={state.mediaIndex}
                onChange={setMediaIndex}
              />
            </div>
          )}
          {event.quotes.map((quote, index) => (
            <div
              key={index}
              className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/50 to-emerald-50 p-8 fade-in-up stagger-2'
            >
              <div className='relative z-10'>
                <blockquote className='text-lg md:text-xl leading-relaxed text-amber-900 font-medium italic mb-4'>
                  "{quote.text}"
                </blockquote>
                <cite className='text-sm text-amber-700 font-medium'>
                  — {quote.source}
                </cite>
                {quote.details && (
                  <p className='mt-4 text-sm text-amber-800 leading-relaxed'>
                    {quote.details}
                  </p>
                )}
              </div>
              {/* Decorative elements */}
              <div className='absolute top-4 right-4 w-16 h-16 bg-amber-200/20 rounded-full'></div>
              <div className='absolute bottom-4 left-4 w-12 h-12 bg-emerald-200/20 rounded-full'></div>
            </div>
          ))}
        </div>
      </Section>

      {/* 2) Interactive Reflection */}
      <Section
        title='Choose Your Path'
        subtitle='Was this an action or a reaction?'
      >
        <div className='flex flex-col gap-4 md:flex-row'>
          <PillButton
            ariaLabel='Choose Action'
            onClick={() => setChoice('action')}
            selected={state.choice === 'action'}
          >
            ✨ Action
          </PillButton>
          <PillButton
            ariaLabel='Choose Reaction'
            onClick={() => setChoice('reaction')}
            selected={state.choice === 'reaction'}
          >
            🔁 Reaction
          </PillButton>
        </div>
      </Section>

      {/* 3) Follow-up Question */}
      {state.choice && (
        <Section
          title='Deep Reflection'
          subtitle={
            state.choice === 'action'
              ? 'Why did he take this action?'
              : 'How did he respond?'
          }
        >
          <div className='space-y-6'>
            <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/50 p-6'>
              <p className='text-lg font-medium text-stone-800 mb-6'>
                {event.followups[state.choice].prompt}
              </p>

              {event.followups[state.choice].type === 'mcq' && (
                <div className='grid gap-4 md:grid-cols-2'>
                  {event.followups[state.choice].choices.map(
                    (c: string, idx: number) => (
                      <label
                        key={idx}
                        className={`group flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all duration-300 ${
                          state.answerIndex === idx
                            ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg scale-105'
                            : 'border-stone-200 bg-white hover:border-amber-300 hover:shadow-md hover:-translate-y-1'
                        }`}
                      >
                        <input
                          type='radio'
                          name='followup'
                          className='mt-1 w-5 h-5 text-amber-600'
                          checked={state.answerIndex === idx}
                          onChange={() => setAnswerIndex(idx)}
                        />
                        <span className='text-stone-800 font-medium group-hover:text-amber-700 transition-colors duration-300'>
                          {c}
                        </span>
                      </label>
                    )
                  )}
                </div>
              )}

              {event.followups[state.choice].type === 'dropdown' && (
                <div className='max-w-md'>
                  <select
                    className='w-full rounded-xl border-2 border-stone-300 bg-white p-4 text-stone-800 focus:border-amber-500 focus:outline-none transition-colors duration-300'
                    value={state.answerIndex ?? ''}
                    onChange={e => setAnswerIndex(Number(e.target.value))}
                  >
                    <option value='' disabled>
                      Select a reason…
                    </option>
                    {event.followups[state.choice].choices.map(
                      (c: string, idx: number) => (
                        <option key={idx} value={idx}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              <div className='flex flex-wrap gap-3'>
                <button
                  onClick={() => setAnswerChecked(true)}
                  disabled={state.answerIndex === null}
                  className='rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-stone-800 transition-colors duration-300'
                >
                  Check Answer
                </button>
                <button
                  onClick={() => setThinkDeeper(!state.thinkDeeper)}
                  className='rounded-xl border-2 border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-800 hover:bg-stone-100 hover:border-amber-300 transition-all duration-300'
                >
                  {state.thinkDeeper ? 'Hide' : 'Think Deeper'}
                </button>
              </div>
            </div>

            {state.answerChecked && (
              <div
                className={`rounded-2xl p-6 text-sm border-2 ${
                  isAnswerCorrect()
                    ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-900 border-rose-300'
                }`}
              >
                <div className='flex items-center gap-3 mb-3'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isAnswerCorrect() ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    {isAnswerCorrect() ? (
                      <svg
                        className='w-5 h-5 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    ) : (
                      <svg
                        className='w-5 h-5 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                      </svg>
                    )}
                  </div>
                  <p className='font-bold text-lg'>
                    {isAnswerCorrect() ? 'Correct! ✔' : "Let's revisit ✧"}
                  </p>
                </div>
                <p className='leading-6'>
                  {event.followups[state.choice].explanation}
                </p>
              </div>
            )}

            {state.thinkDeeper && (
              <div className='rounded-2xl border-2 border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100/50 p-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                      />
                    </svg>
                  </div>
                  <h4 className='font-bold text-lg text-stone-800'>
                    Scholarly Interpretations
                  </h4>
                </div>
                <ul className='space-y-3 text-stone-700'>
                  <li className='flex items-start gap-3'>
                    <div className='w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0'></div>
                    <span>
                      Compare civil pacts vs. state law: how prophetic
                      endorsement shapes civic virtue.
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <div className='w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0'></div>
                    <span>
                      Map to maqāṣid al-sharīʿah and prophetic values
                      (ʿadl/justice, ḥifẓ al-ḥuqūq/rights).
                    </span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <div className='w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0'></div>
                    <span>
                      Insert authenticated citations from your Sessions corpus
                      here.
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* 4) Reflection & Takeaway */}
      <Section
        title='Wisdom & Application'
        subtitle='Lessons, modern parallels, and your personal reflection'
      >
        {/* <div className="grid gap-8 lg:grid-cols-2"> */}
        <div className='space-y-6'>
          <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                </svg>
              </div>
              <h4 className='text-xl font-serif font-bold text-emerald-900'>
                Key Lessons
              </h4>
            </div>
            <ul className='space-y-3 max-h-64 overflow-auto'>
              {event.lessons.map((l, i) => (
                <li key={i} className='flex items-start gap-3'>
                  <div className='w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0'></div>
                  <span className='text-emerald-800 leading-relaxed'>{l}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </div>
              <h4 className='text-xl font-serif font-bold text-blue-900'>
                Modern Parallels
              </h4>
            </div>
            <ul className='space-y-3 max-h-64 overflow-auto'>
              {event.parallels.map((p, i) => (
                <li key={i} className='flex items-start gap-3'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                  <span className='text-blue-800 leading-relaxed'>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
              </div>
              <h4 className='text-xl font-serif font-bold text-amber-900'>
                Personal Reflection
              </h4>
            </div>
            <label
              htmlFor='journal'
              className='block text-sm font-medium text-amber-800 mb-3'
            >
              How can you apply this today?
            </label>
            <textarea
              id='journal'
              value={state.journal}
              onChange={e => setJournal(e.target.value)}
              placeholder='e.g., Speak up for a colleague; support a local justice initiative; commit to fair dealing…'
              className='h-40 w-full resize-none rounded-xl border-2 border-amber-200 bg-white p-4 text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none transition-colors duration-300'
            />
            <div className='mt-3 flex items-center justify-between text-xs text-amber-700'>
              <span className='font-medium'>
                {state.journal.length} characters
              </span>
              {state.savedAt && (
                <span className='font-medium'>Saved: {state.savedAt}</span>
              )}
            </div>
            <div className='mt-4 flex flex-wrap gap-3'>
              <button
                onClick={() => setSavedAt(new Date().toLocaleString())}
                className='rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white hover:bg-amber-700 transition-colors duration-300'
              >
                Save Insight
              </button>
              <button
                onClick={handleShare}
                className='rounded-xl border-2 border-amber-300 bg-white px-6 py-3 text-sm font-bold text-amber-800 hover:bg-amber-50 transition-all duration-300'
              >
                Share
              </button>
              <button
                onClick={resetAll}
                className='rounded-xl border-2 border-rose-300 bg-white px-6 py-3 text-sm font-bold text-rose-700 hover:bg-rose-50 transition-all duration-300'
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Section>

      {/* 5) Navigation & Progress */}
      <Section
        title='Journey Progress'
        subtitle='Track your learning and continue your exploration'
      >
        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/50 p-8'>
          <div className='grid gap-6 md:grid-cols-3 items-center'>
            <div className='text-center'>
              <div className='mb-3'>
                <div className='text-3xl font-bold text-amber-600 mb-1'>
                  {progress}%
                </div>
                <div className='text-sm text-stone-600 font-medium'>
                  Complete
                </div>
              </div>
              <div className='w-full max-w-32 mx-auto'>
                <ProgressBar value={progress} />
              </div>
            </div>

            <div className='text-center'>
              <div className='mb-3'>
                <div className='text-3xl font-bold text-emerald-600 mb-1'>
                  {badges.length}
                </div>
                <div className='text-sm text-stone-600 font-medium'>
                  Badges Earned
                </div>
              </div>
              <div className='flex flex-wrap justify-center gap-2'>
                {badges.slice(0, 3).map((b, i) => (
                  <Badge key={i}>🏅 {b}</Badge>
                ))}
                {badges.length > 3 && <Badge>＋{badges.length - 3} more</Badge>}
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <button className='rounded-xl border-2 border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-800 hover:bg-stone-100 hover:border-amber-300 transition-all duration-300'>
                ← Previous Event
              </button>
              <button className='rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-white hover:bg-stone-800 transition-colors duration-300'>
                Next Event →
              </button>
            </div>
          </div>
        </div>
      </Section>

      <div className='text-center'>
        <p className='text-sm text-stone-500 italic'>
          Replace placeholder texts with authenticated quotes and citations from
          your Sessions corpus.
        </p>
      </div>
    </div>
  );
}
