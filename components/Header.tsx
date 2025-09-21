"use client";

import Link from "next/link";

export default function Header() {
	return (
		<header className="mb-6 flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
			<Link
				href="/"
				className="text-lg font-serif font-semibold text-stone-900"
			>
				Seerah App
			</Link>
			<nav className="flex items-center gap-3 text-sm">
				<Link
					href="/"
					className="rounded-lg px-3 py-1 text-stone-700 hover:bg-stone-100"
				>
					Home
				</Link>
				<Link
					href="/events/hilf-al-fudul"
					className="rounded-lg px-3 py-1 text-stone-700 hover:bg-stone-100"
				>
					Hilf al-Fudul
				</Link>
				<Link
					href="/events/nabuwah"
					className="rounded-lg px-3 py-1 text-stone-700 hover:bg-stone-100"
				>
					Nabuwah
				</Link>
				<Link
					href="/tribes"
					className="rounded-lg px-3 py-1 text-stone-700 hover:bg-stone-100"
				>
					Tribes
				</Link>
				<Link
					href="/map"
					className="rounded-lg px-3 py-1 text-stone-700 hover:bg-stone-100"
				>
					Map
				</Link>
			</nav>
		</header>
	);
}
