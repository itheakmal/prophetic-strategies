export default function Footer() {
	return (
		<footer className="mt-16 card p-8">
			<div className="text-center">
				<div className="mb-4">
					<h3 className="text-lg font-serif font-semibold text-stone-900 mb-2">
						Seerah — Sacred Journey
					</h3>
					<p className="text-stone-600 text-sm max-w-2xl mx-auto">
						Exploring the life of Prophet Muhammad (ﷺ) through interactive timelines, 
						immersive stories, and timeless lessons for the modern world.
					</p>
				</div>
				<div className="border-t border-stone-200 pt-4">
					<p className="text-xs text-stone-500">
						Built with Next.js + Tailwind CSS • © {new Date().getFullYear()} • 
						May Allah bless our efforts in learning and teaching
					</p>
				</div>
			</div>
		</footer>
	);
}
