import { EventData } from '../types';

export const hilfAlFudul: EventData = {
	slug: "hilf-al-fudul",
	title: "Hilf al-Fudul – Pact of the Virtuous",
	location: "Makkah",
	era: "Pre-Prophethood",
	context:
		"A coalition in Makkah formed to uphold justice after an injustice against a Yemeni merchant. Young Muhammad (ﷺ) participated and later praised such a pact.",
	quotes: [
		{
			subtitle: "A timeless message from the Prophet (ﷺ)",
			text: "I witnessed a pact in the house of Ibn Jud'ān; if I were called to it in Islam, I would respond.",
			source: "[Insert hadith/biography ref]",
		}
	],
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
};
