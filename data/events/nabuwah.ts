import { EventData } from '../types';

export const nabuwah: EventData = {
  slug: 'nabuwah',
  title: 'Nabuwah – The First Revelation',
  location: 'Cave of Hira, Makkah',
  era: 'Prophethood',
  context:
    'Prophet Muhammad (ﷺ) received the first revelation from Allah through the angel Gabriel (Jibril) in the cave of Hira. This marked the beginning of his prophethood and the start of Islam.',
  quotes: [
    {
      subtitle: 'Quranic Verse',
      text: 'Read! In the name of your Lord who created. Created man from a clinging substance. Read! And your Lord is the most Generous.',
      source: 'Quran 96:1-3',
    },
  ],
  deeper: [
    "Spiritual preparation: Muhammad's (ﷺ) practice of meditation in the cave of Hira.",
    'The role of revelation in Islamic theology and the nature of prophethood.',
    'Maqāṣid angle: establishing knowledge (ʿilm) as a fundamental human right.',
  ],
  media: [
    {
      type: 'image',
      src: 'https://placehold.co/800x450?text=Cave+of+Hira',
      alt: 'Cave of Hira illustration',
    },
    {
      type: 'image',
      src: 'https://placehold.co/800x450?text=Angel+Gabriel',
      alt: 'Angel Gabriel illustration',
    },
  ],
  lessons: [
    'The importance of seeking knowledge and understanding divine guidance.',
    'Spiritual preparation and contemplation are essential for receiving wisdom.',
    'Divine revelation serves as a foundation for moral and ethical guidance.',
  ],
  parallels: [
    'Modern education systems: the right to knowledge and literacy.',
    'Spiritual practices: meditation, reflection, and seeking divine guidance.',
    'Leadership development: preparation before assuming responsibility.',
  ],
  followups: {
    action: {
      prompt:
        'Why was reading and knowledge emphasized in the first revelation?',
      type: 'dropdown',
      choices: [
        'To establish knowledge as a fundamental right and duty.',
        'To prepare for trade and commerce.',
        'To compete with other religions.',
      ],
      correctIndex: 0,
      explanation:
        'The emphasis on reading establishes knowledge as a fundamental human right and religious duty. [citation]',
    },
    reaction: {
      prompt: 'How did the Prophet ﷺ respond to the first revelation?',
      type: 'mcq',
      choices: [
        'He was initially overwhelmed but accepted the responsibility with faith.',
        'He immediately began preaching publicly.',
        'He rejected the revelation as a hallucination.',
      ],
      correctIndex: 0,
      explanation:
        "The Prophet's initial reaction shows the gravity of prophethood, followed by acceptance and dedication. [citation]",
    },
  },
};
