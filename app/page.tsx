'use client';

import Timeline from '@/components/TimeLine';
import Link from 'next/link';
import { EVENTS } from '@/data';

export default function LandingPage() {
  return (
    <main className='space-y-8'>
      {/* Hero Section */}
      <section className='relative overflow-hidden rounded-3xl hero-gradient p-8 md:p-12'>
        <div className='relative z-10'>
          <div className='fade-in-up'>
            <h1 className='text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-4'>
              Seerah
              <span className='block text-2xl md:text-3xl font-normal text-stone-700 mt-2'>
                Journey Through Sacred History
              </span>
            </h1>
            <p className='text-lg md:text-xl text-stone-700 max-w-3xl leading-relaxed mb-8'>
              Explore the life of Prophet Muhammad (ﷺ) through interactive
              timelines, immersive stories, and timeless lessons that shape our
              understanding of faith and humanity.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                href='/importance'
                className='inline-flex items-center px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors duration-300 font-medium'
              >
                Why Study Seerah?
              </Link>
              <Link
                href='#timeline'
                className='inline-flex items-center px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-stone-400 hover:bg-white/50 transition-all duration-300 font-medium'
              >
                Explore Timeline
              </Link>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className='absolute top-10 right-10 w-20 h-20 bg-amber-200/30 rounded-full floating-animation'></div>
        <div
          className='absolute bottom-10 left-10 w-16 h-16 bg-emerald-200/30 rounded-full floating-animation'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='absolute top-1/2 right-1/4 w-12 h-12 bg-purple-200/30 rounded-full floating-animation'
          style={{ animationDelay: '4s' }}
        ></div>
      </section>

      {/* Stats Section */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='card p-6 text-center fade-in-up stagger-1'>
          <div className='text-3xl font-bold text-amber-600 mb-2'>
            {EVENTS.length}
          </div>
          <div className='text-stone-700 font-medium'>Interactive Events</div>
          <div className='text-sm text-stone-500 mt-1'>Live experiences</div>
        </div>
        <div className='card p-6 text-center fade-in-up stagger-2'>
          <div className='text-3xl font-bold text-emerald-600 mb-2'>∞</div>
          <div className='text-stone-700 font-medium'>Timeless Lessons</div>
          <div className='text-sm text-stone-500 mt-1'>For modern life</div>
        </div>
        <div className='card p-6 text-center fade-in-up stagger-3'>
          <div className='text-3xl font-bold text-purple-600 mb-2'>23</div>
          <div className='text-stone-700 font-medium'>Years of Prophethood</div>
          <div className='text-sm text-stone-500 mt-1'>Rich history</div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id='timeline' className='fade-in-up stagger-4'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-3xl font-serif font-bold text-stone-900 mb-2'>
              Sacred Timeline
            </h2>
            <p className='text-stone-600 max-w-2xl'>
              Journey through pivotal moments in Islamic history. Each event
              offers deep insights, interactive media, and reflective questions
              to enrich our understanding.
            </p>
          </div>
        </div>
        <Timeline />
      </section>
    </main>
  );
}
