# Adding New Events Guide

This guide explains how to add new events to the Hilf al-Fudul application. The event system is designed to be modular and easy to extend.

## File Structure

```
data/
├── types.ts                    # TypeScript interfaces and types
├── utils.ts                   # Helper functions and event aggregation
├── index.ts                   # Main export file
└── events/                    # Individual event files
    ├── arabia-before-islam.ts
    ├── hilf-al-fudul.ts
    ├── reconstruction-of-the-kabah.ts
    ├── nabuwah.ts
    └── flood-of-marib.ts
```

## Steps to Add a New Event

### 1. Create the Event Data File

Create a new file in the `events/` folder following the naming convention: `kebab-case-slug.ts`

**Example:** For an event with slug "first-hijrah", create `events/first-hijrah.ts`

```typescript
import { EventData } from '../types';

export const firstHijrah: EventData = {
  slug: 'first-hijrah',
  title: 'First Hijrah to Abyssinia',
  location: 'Abyssinia (Ethiopia)',
  era: 'Early Prophethood',
  context: 'The first migration of Muslims to escape persecution in Makkah...',
  summary:
    'The first migration of Muslims to escape persecution in Makkah and seek refuge under a just king.',
  quotes: [
    {
      subtitle: 'Prophetic Guidance',
      text: 'Go to Abyssinia, for there is a king there who does not wrong anyone...',
      source: 'Sahih Bukhari',
      details:
        'The Prophet (ﷺ) advised the early Muslims to migrate to Abyssinia...',
    },
  ],
  deeper: [
    'Historical context about the persecution of early Muslims',
    'Details about the King of Abyssinia and his just rule',
    'The significance of this migration in Islamic history',
  ],
  media: [
    {
      type: 'image',
      src: 'https://example.com/hijrah-image.jpg',
      alt: 'Illustration of the Hijrah to Abyssinia',
    },
  ],
  lessons: [
    'The importance of seeking refuge from persecution',
    "Trust in Allah's plan during difficult times",
    'The value of just leadership and governance',
  ],
  parallels: [
    'Modern refugee situations and asylum seeking',
    'The importance of religious freedom',
    'Leadership qualities that protect the vulnerable',
  ],
  followups: {
    action: {
      prompt: 'Why did the Prophet ﷺ advise this migration?',
      type: 'dropdown',
      choices: [
        'To escape persecution and preserve the faith',
        'To establish trade relations',
        'To avoid conflict with Quraysh',
      ],
      correctIndex: 0,
      explanation:
        'The migration was primarily to escape persecution and preserve the Muslim community.',
    },
    reaction: {
      prompt: 'How did the Muslims respond to this advice?',
      type: 'mcq',
      choices: [
        "They immediately followed the Prophet's guidance",
        'They hesitated and stayed in Makkah',
        'They went to different locations',
      ],
      correctIndex: 0,
      explanation:
        "The early Muslims trusted the Prophet's guidance and migrated to Abyssinia.",
    },
  },
};
```

### 2. Update the Utils File

Add your new event to the `EVENTS_DATA` array in `utils.ts`:

```typescript
import { EventData } from './types';
import { arabiaBeforeIslam } from './events/arabia-before-islam';
import { hilfAlFudul } from './events/hilf-al-fudul';
import { reconstructionOfTheKabah } from './events/reconstruction-of-the-kabah';
import { nabuwah } from './events/nabuwah';
import { firstHijrah } from './events/first-hijrah'; // Add this import

// Array of all event data
export const EVENTS_DATA: EventData[] = [
  arabiaBeforeIslam,
  hilfAlFudul,
  reconstructionOfTheKabah,
  nabuwah,
  firstHijrah, // Add your event here
];
```

### 3. Event Cards are Generated Automatically

Event cards are now automatically generated from the event data using the `getEventCards()` function. No separate file is needed!

### 4. That's It!

No additional steps needed. The event will automatically be available through:

- `getEventBySlug('your-event-slug')` - to get individual event data
- `getEventCards()` - to get event cards for display

## Event Data Structure

### Required Fields

- `slug`: Unique identifier (kebab-case)
- `title`: Display title
- `location`: Where the event took place
- `era`: Time period classification
- `context`: Brief description of the event
- `summary`: Short summary for event cards (used in timeline/listing)
- `quotes`: Array of quotes (at least one)
- `deeper`: Array of detailed insights
- `media`: Array of media items (can be empty)
- `lessons`: Array of lessons learned
- `parallels`: Array of modern parallels
- `followups`: Interactive questions (action and reaction)

### Optional Fields

- `quotes[].details`: Additional context for quotes
- `media[].poster`: Video poster image
- `media[].alt`: Alt text for images

## Media Types

### Images

```typescript
{
  type: "image",
  src: "https://example.com/image.jpg",
  alt: "Description of the image"
}
```

### Videos

```typescript
{
  type: "video",
  src: "https://example.com/video.mp4",
  poster: "https://example.com/poster.jpg",
  alt: "Description of the video"
}
```

## Followup Questions

### Action Questions

- `type`: "dropdown" or "mcq"
- `choices`: Array of answer options
- `correctIndex`: Index of the correct answer (0-based)
- `explanation`: Why this answer is correct

### Reaction Questions

- Same structure as action questions
- Focus on how the Prophet (ﷺ) or Muslims responded

## Status Options

- `"Live"`: Event is ready and published
- `"Soon"`: Event is in development

## Best Practices

1. **Naming Convention**: Use kebab-case for file names and slugs
2. **Content Quality**: Ensure all text is accurate and well-sourced
3. **Media**: Use high-quality images and videos with proper alt text
4. **Quotes**: Include proper citations and sources
5. **Lessons**: Make them relevant to modern life
6. **Parallels**: Connect historical events to contemporary issues
7. **Testing**: Test the event page after adding to ensure everything works

## File Changes Summary

When adding a new event, you need to modify these files:

1. ✅ **Create**: `data/events/your-event-slug.ts`
2. ✅ **Update**: `data/utils.ts` (add import and to EVENTS_DATA array)

**Note**: Event cards are now automatically generated from event data, so no separate cards file is needed!

## Using Event Cards

Event cards are generated dynamically using the `getEventCards()` function:

```typescript
import { getEventCards } from '@/data';

// Get all event cards
const allEvents = getEventCards();

// Get limited number of event cards (e.g., show only 3)
const limitedEvents = getEventCards(3);

// Get all events (same as getEventCards())
const allEventsAgain = getEventCards(-1);
```

### Function Parameters

- `limit` (number, optional): Number of events to return
  - `-1` or no parameter: Return all events
  - `n` (positive number): Return first n events
  - `0`: Return empty array

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure the import path in `utils.ts` matches your file name
2. **Type Errors**: Ensure all required fields are present and correctly typed
3. **Slug Conflicts**: Make sure the slug is unique across all events
4. **Missing Media**: If you don't have media, use an empty array `[]`

### Validation

After adding an event, check:

- [ ] Event appears in the timeline
- [ ] Event page loads correctly
- [ ] All quotes display properly
- [ ] Media carousel works (if media is present)
- [ ] Followup questions work correctly
- [ ] No TypeScript errors

## Example: Complete New Event

See the existing event files for complete examples:

- `events/arabia-before-islam.ts`
- `events/hilf-al-fudul.ts`
- `events/reconstruction-of-the-kabah.ts`
- `events/nabuwah.ts`

Each file contains a complete, working example of an event with all required fields properly filled out.
