"use client";

import Link from "next/link";
import Section from "./Section";
import { getEventBySlug, EVENTS } from "@/data";
import MediaCarousel from "./MediaCarousel";
import React from "react";
import SidebarGallery from "./SidebarGallery";
import Details from "./Details";
import { useEvents, useEventActions } from "@/contexts/EventsContext";

export default function AppSidebar() {
  const { state } = useEvents()
  const { setMediaIndex } = useEventActions()
  
  const event = getEventBySlug(state.currentEventId)

console.log(event)

	return (
		<aside className="card p-6">
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
					<h3 className="text-lg font-serif font-bold text-stone-900">Related</h3>
				</div>
				<div className="space-y-3">
					{event && event.media && event.media.length > 0 && (
					<SidebarGallery items={event.media as any} currentIndex={state.mediaIndex} onSelect={setMediaIndex} />
					)}
					{event && event.deeper.length > 0 && (
					<>
					{event.deeper.map((item, index)=>{
						return (
							<Details key={index} summary={item.split(':')[0]}>{item.split(':')[1]}</Details>
						)
					})}
						
					</>
					)}
				</div>
			</div>
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
					<h3 className="text-lg font-serif font-bold text-stone-900">Quick Links</h3>
				</div>
				<ul className="space-y-3">
					{EVENTS.map((event) => (
						<li key={event.slug}>
							<Link
								className={`group block rounded-xl p-4 transition-all duration-300 ${
									event.status === 'Live' 
										? 'bg-gradient-to-br from-stone-50 to-stone-100/50 hover:from-amber-50 hover:to-amber-100/50 hover:shadow-md hover:-translate-y-1 border border-stone-200 hover:border-amber-300' 
										: 'bg-stone-100/50 text-stone-400 cursor-not-allowed border border-stone-200'
								}`}
								href={event.status === 'Live' ? event.href as any : '#'}
							>
								<div className="flex items-center justify-between">
									<div>
										<div className="font-medium text-stone-800 group-hover:text-amber-800 transition-colors duration-300">
											{event.title}
										</div>
										<div className="text-xs text-stone-500 mt-1">
											{event.location} • {event.era}
										</div>
									</div>
									{event.status === 'Live' ? (
										<div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
									) : (
										<div className="text-xs text-stone-400">Soon</div>
									)}
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>

			{/* TODO(back-end): Replace static links with a DB-driven event list:
         - fetch('/api/events') and map results to links
         - cache with SWR/React Query
      */}
	  {/* <Section title="Event Presentation" subtitle="Context, visuals, and a key quote"> */}
        {/* <div className="grid gap-5 md:grid-cols-3"> */}
          
          
        {/* </div> */}
      {/* </Section> */}
		</aside>
	);
}
