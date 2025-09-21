export default function Footer() {
	return (
		<footer className="mt-10 rounded-2xl border border-stone-200 bg-white p-4 text-center text-xs text-stone-500">
			{/* TODO(back-end): Replace with dynamic app meta from settings table/config service */}
			Built with Next.js + Tailwind v4 • © {new Date().getFullYear()}
		</footer>
	);
}
