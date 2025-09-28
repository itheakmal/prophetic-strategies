import { EventData, EventCard } from './types';
import { arabiaBeforeIslam } from './events/arabia-before-islam';
import { hilfAlFudul } from './events/hilf-al-fudul';
import { reconstructionOfTheKabah } from './events/reconstruction-of-the-kabah';
import { nabuwah } from './events/nabuwah';
import { floodOfMarib } from './events/flood-of-marib';

// Array of all event data
export const EVENTS_DATA: EventData[] = [
  arabiaBeforeIslam,
  hilfAlFudul,
  reconstructionOfTheKabah,
  nabuwah,
  floodOfMarib,
];

// Helper function to get event data by slug
export function getEventBySlug(slug: string): EventData | undefined {
  return EVENTS_DATA.find(event => event.slug === slug);
}

// Helper function to generate event cards from event data
export function getEventCards(limit: number = -1): EventCard[] {
  const cards: EventCard[] = EVENTS_DATA.map(event => ({
    slug: event.slug,
    title: event.title,
    location: event.location,
    era: event.era,
    summary: event.summary,
    href: `/events/${event.slug}`,
    status: 'Live' as const,
  }));

  // Return all cards if limit is -1, otherwise return limited number
  return limit === -1 ? cards : cards.slice(0, limit);
}
