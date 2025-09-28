import { EventData } from './types';
import { arabiaBeforeIslam } from './events/arabia-before-islam';
import { hilfAlFudul } from './events/hilf-al-fudul';
import { reconstructionOfTheKabah } from './events/reconstruction-of-the-kabah';
import { nabuwah } from './events/nabuwah';

// Array of all event data
export const EVENTS_DATA: EventData[] = [
	arabiaBeforeIslam,
	hilfAlFudul,
	reconstructionOfTheKabah,
	nabuwah,
];

// Helper function to get event data by slug
export function getEventBySlug(slug: string): EventData | undefined {
	return EVENTS_DATA.find(event => event.slug === slug);
}
