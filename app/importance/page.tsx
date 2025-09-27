'use client';

import Link from 'next/link';
import ExpandableCard from '../../components/ExpandableCard';

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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Pillar 1 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title="Divine Guidance"
            summary="The Prophet (ﷺ) was the living embodiment of the Quran, showing how divine revelation translates into practical wisdom."
            fullContent="Studying his life reveals how divine revelation translates into practical wisdom for daily living, from personal conduct to community leadership. Every action and decision of the Prophet (ﷺ) was guided by divine wisdom, making his life a perfect example for all believers."
            gradientFrom="from-amber-400"
            gradientTo="to-amber-600"
            staggerClass="stagger-1"
          />

          {/* Pillar 2 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Perfect Character"
            summary="Known as 'the walking Quran,' the Prophet (ﷺ) demonstrated perfect moral character in every situation."
            fullContent="From family life to leadership challenges, the Prophet (ﷺ) showed exemplary character that transcended all circumstances. His patience, kindness, justice, and wisdom set the standard for human excellence, making him the perfect role model for all aspects of life."
            gradientFrom="from-emerald-400"
            gradientTo="to-emerald-600"
            staggerClass="stagger-2"
          />

          {/* Pillar 3 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            title="Timeless Wisdom"
            summary="The Prophet's (ﷺ) teachings transcend time and culture, offering solutions to modern challenges."
            fullContent="His teachings provide solutions to modern challenges in governance, social justice, and warfare. The principles he established remain relevant across all cultures and time periods, demonstrating the universal nature of divine guidance and human wisdom."
            gradientFrom="from-purple-400"
            gradientTo="to-purple-600"
            staggerClass="stagger-3"
          />

          {/* Pillar 4 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
            title="The Time of Treachery"
            summary="A prophetic warning about times when truth and falsehood become inverted in society."
            fullContent="There will come upon the people years of deception, in which the liar is believed, and the truthful is disbelieved; the treacherous is trusted, and the trustworthy is considered treacherous; and the Ruwaybidah will speak. This hadith describes the moral confusion that will characterize the end times, making the study of authentic sources like Seerah even more crucial."
            gradientFrom="from-red-400"
            gradientTo="to-red-600"
            staggerClass="stagger-4"
          />
          
          {/* Pillar 5 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            title="Sunnah in Times of Division"
            summary="A prophetic instruction to hold fast to authentic guidance during times of controversy and division."
            fullContent="Verily he among you who lives long will see great controversy, so you must keep to my Sunnah and to the Sunnah of the Khulafa ar-Rashideen, those who guide to the right way. Cling to it stubbornly [with your molar teeth]. This emphasizes the importance of following the authentic path during times of confusion and division."
            gradientFrom="from-orange-400"
            gradientTo="to-orange-600"
            staggerClass="stagger-5"
          />
          
          {/* Pillar 6 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            title="The Fall of the Khilafah"
            summary="Historical analysis of how internal conflicts weakened Muslim unity and enabled external threats."
            fullContent="While Abbasid Caliphate and The Khwarazmian Empire fought each other, a new threat emerged. Indeed, the disbelievers are allies of one another. But if you, O Muslims, do not also ally with one another, there will be fitnah and great corruption in the land. This highlights the importance of unity in facing external challenges."
            gradientFrom="from-indigo-400"
            gradientTo="to-indigo-600"
            staggerClass="stagger-6"
          />
          
          {/* Pillar 7 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            title="Scholarly Response"
            summary="Academic analysis of the Prophet's strategic approach to building a global community."
            fullContent="They realized: Rasulullah ﷺ began his movement alone, in a society dominated by enemies, yet he was able to establish a global Ummah. So the question became: 'How did he do it?' 'What were his strategies?' 'How can we replicate his approach today?' This scholarly inquiry drives modern research into prophetic methodology."
            gradientFrom="from-cyan-400"
            gradientTo="to-cyan-600"
            staggerClass="stagger-7"
          />
          
          {/* Pillar 8 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="One Event, Two Perspectives"
            summary="How different scholarly approaches can lead to varied interpretations of the same historical event."
            fullContent="Rasulullah ﷺ was praying in front of the Ka'bah when some placed intestine of camel on his back. Scholars analyzed it differently: Was he ﷺ praying an obligatory prayer? Did he repeat afterward? Is camel filth najis? Other scholars said: Why didn't he ﷺ call his companions? Why no retaliation? Why only du'ā'? This demonstrates the complexity of scholarly analysis."
            gradientFrom="from-pink-400"
            gradientTo="to-pink-600"
            staggerClass="stagger-8"
          />
          
          {/* Pillar 9 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title="Sun Tzu's Art of War"
            summary="Strategic principles that emphasize the importance of self-knowledge and understanding your opponent."
            fullContent="If you know your enemy and you know yourself, you will not be defeated in a hundred battles. If you know yourself but not your enemy, for every victory, there will also be a loss. And if you know neither yourself nor your enemy, you will lose every battle. These timeless principles apply to all forms of strategic thinking."
            gradientFrom="from-yellow-400"
            gradientTo="to-yellow-600"
            staggerClass="stagger-9"
          />
          
          {/* Pillar 10 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Western Experts"
            summary="Prominent Western scholars who have studied Islamic history and strategic thinking."
            fullContent="Pieter Van Ostaeyen - A Belgian Arabist and historian. Elizabeth Kendall - A British researcher and BBC analyst. Cole Bunzel - historian/Arabist; Fellow at the Hoover Institution. These experts provide valuable external perspectives on Islamic history and strategy."
            gradientFrom="from-lime-400"
            gradientTo="to-lime-600"
            staggerClass="stagger-10"
          />
          
          {/* Pillar 11 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title="Educational Reform"
            summary="Post-war changes in educational systems and their impact on traditional knowledge transmission."
            fullContent="After World War II, the United States implemented a new form of control: Curriculum engineering, abolished the traditional education system. In Germany: The same model was applied. This systematic change affected how knowledge and values were transmitted to future generations."
            gradientFrom="from-teal-400"
            gradientTo="to-teal-600"
            staggerClass="stagger-11"
          />
         
          {/* Pillar 12 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            title="Strategic Dispersal"
            summary="The Prophet's strategic approach to spreading the message through calculated placement of companions."
            fullContent="Abu Dharr al-Ghifari رضي الله عنه. Rasulullah ﷺ met him before migrating to Madinah, He accepted Islam, But the Prophet ﷺ did not take him along to Madinah. This demonstrates the strategic thinking behind the placement of believers in different locations for maximum impact."
            gradientFrom="from-violet-400"
            gradientTo="to-violet-600"
            staggerClass="stagger-12"
          />
          
          {/* Pillar 13 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            title="Strategic Military Analysis"
            summary="Western military analysis of the Prophet's strategic and tactical approaches to warfare."
            fullContent="Russ Rodgers, a retired American military veteran who studied the life of Rasulullah ﷺ for military insight. He authored: 'The Generalship of Muhammad ﷺ'. This book is taught in Western military academies and serves as a manual for modern asymmetric warfare. This demonstrates the universal applicability of prophetic strategies."
            gradientFrom="from-slate-400"
            gradientTo="to-slate-600"
            staggerClass="stagger-13"
          />

          {/* Pillar 14 */}
          <ExpandableCard
            icon={
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Genghis Khan and Salahuddin Ayyubi"
            summary="Comparative analysis of strategic approaches across different historical leaders and contexts."
            fullContent="There are clear parallels between: The early phase of Genghis Khan's rise, The initial mission of Rasulullah ﷺ, and The strategic brilliance of Salahuddin Ayyubi. His military genius is matched only by his diplomatic mastery. These comparisons reveal universal principles of leadership and strategy."
            gradientFrom="from-amber-400"
            gradientTo="to-amber-600"
            staggerClass="stagger-14"
          />
          
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
