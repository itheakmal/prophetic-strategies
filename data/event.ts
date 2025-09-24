export type MediaItem = {
	type: "image" | "video";
	src: string;
	alt?: string;
	poster?: string;
};

export type EventData = {
	slug: string;
	title: string;
	location: string;
	era: string;
	context: string;
	quote: {
		text: string;
		source: string;
	};
	deeper: string[];
	media: MediaItem[];
	lessons: string[];
	parallels: string[];
	followups: {
		action: {
			prompt: string;
			type: "dropdown" | "mcq";
			choices: string[];
			correctIndex: number;
			explanation: string;
		};
		reaction: {
			prompt: string;
			type: "dropdown" | "mcq";
			choices: string[];
			correctIndex: number;
			explanation: string;
		};
	};
};

export const EVENTS_DATA: EventData[] = [
	{
		slug: "hilf-al-fudul",
		title: "Hilf al-Fudul – Pact of the Virtuous",
		location: "Makkah",
		era: "Pre-Prophethood",
		context:
			"A coalition in Makkah formed to uphold justice after an injustice against a Yemeni merchant. Young Muhammad (ﷺ) participated and later praised such a pact.",
		quote: {
			text: "I witnessed a pact in the house of Ibn Jud'ān; if I were called to it in Islam, I would respond.",
			source: "[Insert hadith/biography ref]",
		},
		deeper: [
			"Social conditions: oligarchic trade networks; weak legal recourse for outsiders.",
			"Tribal dynamics: honor, protection, and inter-tribal arbitration.",
			"Maqāṣid angle: preserving dignity (ʿirḍ) and wealth (māl) through collective action.",
		],
		media: [
			{
				type: "image",
				src: "https://placehold.co/800x450?text=Hilf+al-Fudul+1",
				alt: "Placeholder illustration 1",
			},
			{
				type: "image",
				src: "https://placehold.co/800x450?text=Meccan+Market",
				alt: "Placeholder illustration 2",
			},
			{
				type: "video",
				src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
				poster: "https://placehold.co/800x450?text=Video+Poster",
				alt: "Placeholder video",
			},
		],
		lessons: [
			"Stand up for justice even when non-state or civil coalitions lead.",
			"Support cross-tribal/cross-community alliances around ethical principles.",
			"Public endorsement of virtue builds moral norms that outlive a single event.",
		],
		parallels: [
			"Civic responsibility: ombudsman programs, community mediation boards.",
			"Ethical leadership: speaking for the vulnerable in corporate/governance settings.",
			"Coalition-building across differences for shared moral outcomes.",
		],
		followups: {
			action: {
				prompt: "Why did the Prophet ﷺ take (and later praise) this action?",
				type: "dropdown",
				choices: [
					"To establish justice and protect the oppressed.",
					"For trade advantage only.",
					"To strengthen only his own clan.",
				],
				correctIndex: 0,
				explanation:
					"The moral core was justice and collective responsibility beyond narrow tribal interest. [citation]",
			},
			reaction: {
				prompt: "How did the Prophet ﷺ respond in that context?",
				type: "mcq",
				choices: [
					"He supported the pact's principles and would answer its call.",
					"He stayed neutral and avoided comment.",
					"He opposed it as purely political.",
				],
				correctIndex: 0,
				explanation:
					"He affirmed the pact's ethos of justice and said he would support it even later. [citation]",
			},
		},
	},
	{
		slug: "nabuwah",
		title: "Nabuwah – The First Revelation",
		location: "Cave of Hira, Makkah",
		era: "Prophethood",
		context:
			"Prophet Muhammad (ﷺ) received the first revelation from Allah through the angel Gabriel (Jibril) in the cave of Hira. This marked the beginning of his prophethood and the start of Islam.",
		quote: {
			text: "Read! In the name of your Lord who created. Created man from a clinging substance. Read! And your Lord is the most Generous.",
			source: "Quran 96:1-3",
		},
		deeper: [
			"Spiritual preparation: Muhammad's (ﷺ) practice of meditation in the cave of Hira.",
			"The role of revelation in Islamic theology and the nature of prophethood.",
			"Maqāṣid angle: establishing knowledge (ʿilm) as a fundamental human right.",
		],
		media: [
			{
				type: "image",
				src: "https://placehold.co/800x450?text=Cave+of+Hira",
				alt: "Cave of Hira illustration",
			},
			{
				type: "image",
				src: "https://placehold.co/800x450?text=Angel+Gabriel",
				alt: "Angel Gabriel illustration",
			},
		],
		lessons: [
			"The importance of seeking knowledge and understanding divine guidance.",
			"Spiritual preparation and contemplation are essential for receiving wisdom.",
			"Divine revelation serves as a foundation for moral and ethical guidance.",
		],
		parallels: [
			"Modern education systems: the right to knowledge and literacy.",
			"Spiritual practices: meditation, reflection, and seeking divine guidance.",
			"Leadership development: preparation before assuming responsibility.",
		],
		followups: {
			action: {
				prompt: "Why was reading and knowledge emphasized in the first revelation?",
				type: "dropdown",
				choices: [
					"To establish knowledge as a fundamental right and duty.",
					"To prepare for trade and commerce.",
					"To compete with other religions.",
				],
				correctIndex: 0,
				explanation:
					"The emphasis on reading establishes knowledge as a fundamental human right and religious duty. [citation]",
			},
			reaction: {
				prompt: "How did the Prophet ﷺ respond to the first revelation?",
				type: "mcq",
				choices: [
					"He was initially overwhelmed but accepted the responsibility with faith.",
					"He immediately began preaching publicly.",
					"He rejected the revelation as a hallucination.",
				],
				correctIndex: 0,
				explanation:
					"The Prophet's initial reaction shows the gravity of prophethood, followed by acceptance and dedication. [citation]",
			},
		},
	},
];

export type Followup = EventData['followups']['action'] | EventData['followups']['reaction'];

export type EventCard = {
	slug: string;
	title: string;
	location: string;
	era: string;
	summary: string;
	href: string;
	status: "Live" | "Soon";
};

export const EVENTS: EventCard[] = [
	{
		slug: "hilf-al-fudul",
		title: "Hilf al-Fudul – Pact of the Virtuous",
		location: "Makkah",
		era: "Pre-Prophethood",
		summary:
			"A coalition formed in Makkah to uphold justice after an injustice against a merchant — an early model of civic virtue.",
		href: "/events/hilf-al-fudul",
		status: "Live",
	},
	{
		slug: "nabuwah",
		title: "Nabuwah – The First Revelation",
		location: "Cave of Hira, Makkah",
		era: "Prophethood",
		summary:
			"Prophet Muhammad (ﷺ) received the first revelation from Allah through the angel Gabriel (Jibril) in the cave of Hira.",
		href: "/events/nabuwah",
		status: "Live",
	},
];

// Helper function to get event data by slug
export function getEventBySlug(slug: string): EventData | undefined {
	return EVENTS_DATA.find(event => event.slug === slug);
}

/* TODO(back-end):
   Replace this static array with a typed DB model:
   - Table: events (id, slug, title, era, location, summary, status, hero_image, etc.)
   - API: GET /api/events -> EventCard[]
   - Client: Timeline (client) or a server component that fetches and passes data
*/
