import { db } from '@/lib/db/client';

export async function listEvents() {
  const events = await db.event.findMany({
    where: { deletedAt: null },
    orderBy: { chronologyOrder: 'asc' },
  });

  return events.map(event => ({
    slug: event.slug,
    title: event.title,
    location: event.location,
    era: event.era,
    summary: event.summary,
    href: `/events/${event.slug}`,
    status: 'Live' as const,
  }));
}

export async function getEventBySlug(slug: string) {
  const event = await db.event.findUnique({
    where: { slug },
    include: {
      quotes: { orderBy: { sortOrder: 'asc' } },
      mediaItems: { orderBy: { sortOrder: 'asc' } },
      followupQuestions: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!event || event.deletedAt) return null;

  const followups = event.followupQuestions.reduce<Record<string, any>>((acc, item) => {
    acc[item.questionType] = {
      prompt: item.prompt,
      type: item.inputType,
      choices: item.choices,
      correctIndex: item.correctIndex,
      explanation: item.explanation,
    };
    return acc;
  }, {});

  return {
    slug: event.slug,
    title: event.title,
    location: event.location,
    era: event.era,
    context: event.context,
    summary: event.summary,
    deeper: event.deeperPoints,
    lessons: event.lessons,
    parallels: event.parallels,
    quotes: event.quotes.map(q => ({
      subtitle: q.subtitle,
      text: q.text,
      source: q.source,
      details: q.details,
    })),
    media: event.mediaItems.map(m => ({
      type: m.type,
      src: m.src,
      alt: m.alt,
      poster: m.poster,
    })),
    followups: Object.keys(followups).length === 0 ? undefined : followups,
  };
}
