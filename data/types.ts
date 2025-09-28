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
	quotes: {
		subtitle: string;
		text: string;
		source: string;
		details?: string;
	}[];
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
