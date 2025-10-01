import { EventData } from '../types';

export const arabiaBeforeIslam: EventData = {
  slug: 'arabia-before-islam',
  title: 'Arabia before Islam',
  location: 'Makkah',
  era: 'Pre-Prophethood',
  context:
    'The Arabs were the first recipients of revelation, we must look at their social norms, political landscape, moral values, and the governing structure of pre Islamic Arabia.',
  summary:
    'The Arabian Peninsula lacked a central government. Neighboring superpowers, Roman and Sassanian used Arab client tribes as buffers and proxies: Ghassan for the Romans and Lakhmids for the Persians. Makkah functioned as a revered, central node due to the Kaʿbah, drawing tribes for ritual and trade despite widespread fragmentation and inter-tribal raiding.',
  quotes: [
    {
      subtitle: 'Quranic Verse',
      text: "And when they commit an immorality, they say, 'We found our fathers doing it, and Allah has ordered us to do it.' Say, 'Indeed, Allah does not order immorality. Do you say about Allah that which you do not know?'",
      source: 'Sūrat al-Aʿrāf (7:28)',
      details:
        "In Ṣaḥīḥ al-Bukhārī (ḥadīth 5127) ʿĀ'ishah (RA) describes the different forms of marriages that existed before Islam. 1. Formal Marriage (Resembled Today's Nikāḥ). 2. Nikāḥ al-Istibḍāʾ (Strategic Conception for Tribal Protection). 3. Group Marriages (Rotational Paternity). 4. Open Prostitution (Flag Marriage)",
    },
  ],
  deeper: [
    "Ibn Shihāb al-Zuhrī: Imām al-Zuhrī was among the earliest great scholars of ḥadīth and sīrah (maghazi). He was a tabi'i and teacher of Ibn-e-Ishaq.",
    "Conditions for Knowledge: Al-Zuhrī said 'Do not try to master knowledge over night, for verily knowledge is like vast valleys. Take knowledge over the days and nights. And do not take it all at once, for whoever tries to take it all at once will lose it all at once. Rather take it bit by bit over the days and nights.'",
    "Consistency in Learning: Prophet Muhammad (ﷺ) said 'Take up good deeds only as much as you are able, for the best deeds are those done regularly even if they are few.'",
    "Role of Teacher: A saying from earlier scholars is 'Whoever takes his book as his only teacher, his mistakes will be more than his correct statements.' So it is important to connect with scholars.",
    "Islam Began as Strange: Prophet Muhammad (ﷺ) said 'Islam began as something strange, and it will return to being strange as it began, so glad tidings to the strangers.'",
  ],
  media: [],
  lessons: [
    'Pre-Islamic Arabian Peninsula had Fragmented Tribal Society no Central Government, it was a collection of tribes, clans, and families.',
    "Arabia's Neighbors were two great empires, The Roman and Persian Empires.",
    'Banu Ghassan (Roman Allies) neighbors of the Roman Empire, embraced Christianity.',
    'Banu Lakhm (Persian Allies) neighbors of the Persian Empire, remained polytheists.',
    'Societies without unity or central governance risk becoming proxies for stronger powers, their resources and people used to serve foreign interests.',
    'Jāhiliyyah economy was seasonal trade, ribā, raiding and slavery',
  ],
  parallels: [
    'Overton Window (modern political science concept): It describes the range of ideas a society sees as acceptable or mainstream.',
    'Politicians (or leaders) operate within this window to gain support.',
    'Ideas outside the window are dismissed as strange, unacceptable, or too radical.',
    'The Prophet ﷺ was sent into a broken, chaotic, immoral society with no state, no unity, and no moral compass—and transformed it within 23 years. To replicate this transformation, one must study the environment, the strategy, and the tools used in real context.'
  ],
  followups: {
    action: {
      prompt: 'Why did the Prophet ﷺ take (and later praise) this action?',
      type: 'dropdown',
      choices: [],
      correctIndex: 0,
      explanation: '',
    },
    reaction: {
      prompt: 'How did the Prophet ﷺ respond in that context?',
      type: 'mcq',
      choices: [],
      correctIndex: 0,
      explanation: '',
    },
  },
};
