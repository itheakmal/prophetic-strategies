"use client";

import Link from "next/link";
import Section from "./Section";
import { EVENT } from "@/data/event";
import MediaCarousel from "./MediaCarousel";
import React from "react";
import SidebarGallery from "./SidebarGallery";
import Details from "./Details";
import { useEvents, useEventActions } from "@/contexts/EventsContext";

export default function AppSidebar() {
  const { state } = useEvents()
  const { setMediaIndex } = useEventActions()



	return (
		<aside className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
			<h3 className="mb-2 text-sm font-semibold text-stone-800">Quick Links</h3>
			<ul className="space-y-2 text-sm">
				<li>
					<Link
						className="text-stone-700 hover:underline"
						href="/events/hilf-al-fudul"
					>
						Hilf al-Fudul
					</Link>
				</li>
				<li>
					<Link className="pointer-events-none text-stone-400" href="#">
						Event 2 (coming soon)
					</Link>
				</li>
			</ul>

			{/* TODO(back-end): Replace static links with a DB-driven event list:
         - fetch('/api/events') and map results to links
         - cache with SWR/React Query
      */}
	  {/* <Section title="Event Presentation" subtitle="Context, visuals, and a key quote"> */}
        {/* <div className="grid gap-5 md:grid-cols-3"> */}
          
          <div className="space-y-3">
            {EVENT.media && EVENT.media.length > 0 && (
              <SidebarGallery items={EVENT.media as any} currentIndex={state.mediaIndex} onSelect={setMediaIndex} />
            )}
            <Details summary="Social conditions in Makkah">{EVENT.deeper[0]}</Details>
            <Details summary="Tribal dynamics">{EVENT.deeper[1]}</Details>
            <Details summary="Think Deeper (scholarly notes)">
              <ul className="list-disc pl-5">
                <li>{EVENT.deeper[2]}</li>
                <li>Insert authenticated hadith/biographical references here with exact wording & citations.</li>
              </ul>
            </Details>
          </div>
        {/* </div> */}
      {/* </Section> */}
		</aside>
	);
}
