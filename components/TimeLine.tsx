"use client";

import Link from "next/link";
import { EVENTS } from "@/data/event";

export default function Timeline() {
	return (
		<div className="grid gap-4 md:grid-cols-2">
			{EVENTS.map((ev) => (
				<Link
					key={ev.slug}
					href={ev.href as any}
					className="group relative rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ring-amber-200/0 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-2"
				>
					<div className="mb-2 text-xs uppercase tracking-wide text-stone-500">
						{ev.era} • {ev.location}
					</div>
					<h3 className="text-lg font-semibold text-stone-900">{ev.title}</h3>
					<p className="mt-2 line-clamp-3 text-sm text-stone-700">
						{ev.summary}
					</p>
					<span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
						{ev.status}
					</span>
				</Link>
			))}
		</div>
	);
}

/* TODO(back-end):
   - Replace import from '@/data/events' with a server component
     that fetches from /api/events (DB) and passes data as props.
   - Add ISR or streaming for large lists.
*/
