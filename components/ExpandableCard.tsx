'use client';

import { useState } from 'react';

interface ExpandableCardProps {
  icon: React.ReactNode;
  title: string;
  summary: string;
  fullContent: string;
  gradientFrom: string;
  gradientTo: string;
  staggerClass: string;
}

export default function ExpandableCard({
  icon,
  title,
  summary,
  fullContent,
  gradientFrom,
  gradientTo,
  staggerClass
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`relative fade-in-up ${staggerClass} group`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Base Card - Always visible */}
      <div className="card p-6 transition-all duration-300 group-hover:shadow-xl">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">
          {title}
        </h3>
        
        <p className="text-stone-700 leading-relaxed text-sm">
          {summary}
        </p>
        
        <div className="mt-4 flex items-center text-xs text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="mr-2">Hover for details</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Content - Overlay */}
      <div className={`absolute top-0 left-0 right-0 z-10 card p-6 bg-white shadow-2xl border border-stone-200 transition-all duration-300 ease-in-out ${
        isExpanded 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
      }`}>
        <div className={`w-14 h-14 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center mb-4`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">
          {title}
        </h3>
        
        <div className="space-y-3">
          <p className="text-stone-700 leading-relaxed text-sm">
            {summary}
          </p>
          <div className="border-t border-stone-200 pt-3">
            <p className="text-stone-600 leading-relaxed text-sm">
              {fullContent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
