'use client';

import Link from 'next/link';

export default function ImportancePage() {
  return (
    <main className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl hero-gradient p-8 md:p-16 text-center">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="fade-in-up">
            <h1 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 mb-6">
              Why Study
              <span className="block text-amber-600">Seerah?</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-700 leading-relaxed mb-8">
              The life of Prophet Muhammad (ﷺ) is not just history—it's a living guide 
              that illuminates our path in the modern world.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-8 py-4 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors duration-300 font-medium text-lg"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-24 h-24 bg-amber-200/40 rounded-full floating-animation"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-emerald-200/40 rounded-full floating-animation" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-purple-200/40 rounded-full floating-animation" style={{animationDelay: '1.5s'}}></div>
      </section>

      {/* Core Reasons Section */}
      <section className="space-y-12">
        <div className="text-center fade-in-up">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            Why Study Seerah Today?
          </h2>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto">
            Discover why the study of Seerah is essential for every Muslim and 
            how it transforms our understanding of faith, leadership, and humanity in the modern world.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Pillar 1 */}
          <div className="card p-8 fade-in-up stagger-1 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              Divine Guidance
            </h3>
            <p className="text-stone-700 leading-relaxed">
              The Prophet (ﷺ) was the living embodiment of the Quran. Studying his life 
              reveals how divine revelation translates into practical wisdom for daily living.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="card p-8 fade-in-up stagger-2 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              Perfect Character
            </h3>
            <p className="text-stone-700 leading-relaxed">
              Known as "the walking Quran," the Prophet (ﷺ) demonstrated perfect moral 
              character in every situation—from family life to leadership challenges.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="card p-8 fade-in-up stagger-3 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              Timeless Wisdom
            </h3>
            <p className="text-stone-700 leading-relaxed">
              The Prophet's (ﷺ) teachings transcend time and culture, offering 
              solutions to modern challenges in governance, social justice, and warfare.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="card p-8 fade-in-up stagger-4 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              The Time of Treachery
            </h3>
            <p className="text-stone-700 leading-relaxed">
            There will come upon the people years of deception, in which the liar is believed, and the truthful is disbelieved; the treacherous is trusted, and the trustworthy is considered treacherous; and the Ruwaybidah will speak.
            </p>
          </div>
          
          {/* Pillar 5 */}
          <div className="card p-8 fade-in-up stagger-5 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
            Sunnah in Times of Division
            </h3>
            <p className="text-stone-700 leading-relaxed">
            Verily he among you who lives long will see great controversy, so you must keep to my Sunnah and to the Sunnah of the Khulafa ar-Rashideen, those who guide to the right way. Cling to it stubbornly [with your molar teeth].
            </p>
          </div>
          
          {/* Pillar 6 */}
          <div className="card p-8 fade-in-up stagger-6 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              The Fall of the Khilafah
            </h3>
            <p className="text-stone-700 leading-relaxed">
              While Abbasid Caliphate and The Khwarazmian Empire fought each other, a new threat emerged. Indeed, the disbelievers are allies of one another. But if you, O Muslims, do not also ally with one another, there will be fitnah and great corruption in the land.
            </p>
          </div>
          
          {/* Pillar 7 */}
          <div className="card p-8 fade-in-up stagger-7 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
            Scholarly Response
            </h3>
            <p className="text-stone-700 leading-relaxed">
              They realized: Rasulullah ﷺ began his movement alone, in a society dominated by enemies, yet he was able to establish a global Ummah. So the question became: "How did he do it?" "What were his strategies?" "How can we replicate his approach today?"
            </p>
          </div>
          
          {/* Pillar 8 */}
          <div className="card p-8 fade-in-up stagger-8 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
            One Event, Two Perspectives
            </h3>
            <p className="text-stone-700 leading-relaxed">
              Rasulullah ﷺ was praying in front of the Ka'bah when some placed intestine of camel on his back. Scholars analyzed it differently: Was he ﷺ praying an obligatory prayer? Did he repeat afterward? Is camel filth najis? Other scholars said: Why didn't he ﷺ call his companions? Why no retaliation? Why only du'ā'?
            </p>
          </div>
          
          {/* Pillar 9 */}
          <div className="card p-8 fade-in-up stagger-9 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
            Sun Tzu's "Art of War"
            </h3>
            <p className="text-stone-700 leading-relaxed">
              If you know your enemy and you know yourself, you will not be defeated in a hundred battles. If you know yourself but not your enemy, for every victory, there will also be a loss. And if you know neither yourself nor your enemy, you will lose every battle.
            </p>
          </div>
          
          {/* Pillar 10 */}
          <div className="card p-8 fade-in-up stagger-10 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
            Western Experts
            </h3>
            <p className="text-stone-700 leading-relaxed">
              <strong>Pieter Van Ostaeyen</strong> - A Belgian Arabist and historian.<br />
              <strong>Elizabeth Kendall</strong> - A British researcher and BBC analyst.<br />
              <strong>Cole Bunzel</strong> - historian/Arabist; Fellow at the Hoover Institution
            </p>
          </div>
          
          {/* Pillar 11 */}
          <div className="card p-8 fade-in-up stagger-11 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
            Educational Reform
            </h3>
            <p className="text-stone-700 leading-relaxed">
              After World War II, the United States implemented a new form of control: Curriculum engineering, abolished the traditional education system. In Germany: The same model was applied.
            </p>
          </div>
         
          {/* Pillar 12 */}
          <div className="card p-8 fade-in-up stagger-12 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
            Strategic Dispersal
            </h3>
            <p className="text-stone-700 leading-relaxed">
              Abu Dharr al-Ghifari رضي الله عنه. Rasulullah ﷺ met him before migrating to Madinah, He accepted Islam, But the Prophet ﷺ did not take him along to Madinah.
            </p>
          </div>
          
          {/* Pillar 13 */}
          <div className="card p-8 fade-in-up stagger-13 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
            Strategic Military Analysis
            </h3>
            <p className="text-stone-700 leading-relaxed">
              <strong>Russ Rodgers</strong>, a retired American military veteran who studied the life of Rasulullah ﷺ for military insight. He authored: <em>"The Generalship of Muhammad ﷺ"</em>. This book is taught in Western military academies and serves as a manual for modern asymmetric warfare.
            </p>
          </div>

          {/* Pillar 14 */}
          <div className="card p-8 fade-in-up stagger-14 group hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
            Genghis Khan and Salahuddin Ayyubi
            </h3>
            <p className="text-stone-700 leading-relaxed">
              There are clear parallels between: The early phase of Genghis Khan's rise, The initial mission of Rasulullah ﷺ, and The strategic brilliance of Salahuddin Ayyubi. His military genius is matched only by his diplomatic mastery.
            </p>
          </div>
          
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 to-stone-800 p-8 md:p-16 text-center">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="fade-in-up">
            <blockquote className="text-2xl md:text-4xl font-serif font-light text-white leading-relaxed mb-8">
              "Indeed in the Messenger of Allah you have an excellent example 
              for whoever has hope in Allah and the Last Day."
            </blockquote>
            <cite className="text-lg text-stone-300">
              — Quran 33:21
            </cite>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-500/10 rounded-full"></div>
      </section>

      {/* Modern Relevance Section */}
      <section className="space-y-12">
        <div className="text-center fade-in-up">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            Relevance Today
          </h2>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto">
            The Prophet's (ﷺ) life offers practical solutions to contemporary challenges 
            in leadership, social justice, and human development.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="card p-8 fade-in-up stagger-1">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              Leadership Excellence
            </h3>
            <p className="text-stone-700 leading-relaxed mb-6">
              From managing a diverse community to making difficult decisions, 
              the Prophet (ﷺ) demonstrated leadership principles that remain 
              relevant for modern organizations and governance.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-stone-700">Consultative decision-making (Shura)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-stone-700">Servant leadership and humility</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-stone-700">Justice and equality for all</span>
              </li>
            </ul>
          </div>

          <div className="card p-8 fade-in-up stagger-2">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              Strategical thinking
            </h3>
            <p className="text-stone-700 leading-relaxed mb-6">
            The Prophet (ﷺ) demonstrated exceptional strategic thinking. He formed alliances, knew when to confront and when to negotiate. His decisions reflected a deep awareness of the geopolitical dynamics of his time.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-stone-700">The early secret phase of da'wah</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-stone-700">Migration to Abyssinia (Habashah)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-stone-700">Seeking support in Ṭā’if</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center fade-in-up">
        <div className="card p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">
            Begin Your Journey Today
          </h2>
          <p className="text-lg text-stone-700 leading-relaxed mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are discovering the timeless wisdom 
            of the Prophet's (ﷺ) life and transforming their understanding of faith.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center px-8 py-4 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors duration-300 font-medium text-lg"
            >
              Explore Timeline
            </Link>
            <Link 
              href="/events/hilf-al-fudul" 
              className="inline-flex items-center px-8 py-4 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-all duration-300 font-medium text-lg"
            >
              Start with Hilf al-Fudul
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
