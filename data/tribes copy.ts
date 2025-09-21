// data/tribes.ts
export type TribeRef = { label: string; url: string };

export type TribeNode = {
  id: string;
  name: string;
  group: 'Quraysh' | 'Taif' | 'Yathrib' | 'Najd';
  x: number; // 0..100 layout
  y: number; // 0..100 layout
  elders?: string[];   // elders/notables for Meccan phase context
  chiefs?: string[];   // chiefs (where attested)
  refs?: TribeRef[];   // citations
};

export type TribeLink = {
  source: string;
  target: string;
  kind: 'alliance' | 'war';
  note?: string;
};

export const TRIBE_NODES: TribeNode[] = [
  // Quraysh umbrella + clans (no Hilf/Ahlaf labels; we just link alliances directly)
  { id: 'q', name: 'Quraysh (collective)', group: 'Quraysh', x: 50, y: 8 },

  { id: 'hashim', name: 'Banu Hashim', group: 'Quraysh', x: 20, y: 24,
    chiefs: ['Abu Talib ibn Abd al-Muttalib'],
    elders: ['Abd al-Muttalib (earlier)', 'Abu Lahab (later)'],
    refs: [{ label: 'Abu Talib (chief)', url: 'https://en.wikipedia.org/wiki/Abu_Talib_ibn_Abd_al-Muttalib' }] },

  { id: 'muttalib', name: 'Banu Muttalib', group: 'Quraysh', x: 32, y: 28 },

  { id: 'zuhra', name: 'Banu Zuhra', group: 'Quraysh', x: 28, y: 38,
    elders: ['Sa‘d ibn Abi Waqqas', '‘Abd al-Rahman ibn ‘Awf'] },

  { id: 'taym', name: 'Banu Taym', group: 'Quraysh', x: 18, y: 44,
    elders: ['Abu Bakr as-Siddiq'] },

  { id: 'asad', name: 'Banu Asad', group: 'Quraysh', x: 36, y: 46,
    elders: ['Khuwaylid ibn Asad', 'Khadijah bint Khuwaylid', 'Zubayr ibn al-Awwam'] },

  { id: 'makhzum', name: 'Banu Makhzum', group: 'Quraysh', x: 68, y: 28,
    chiefs: ['al-Walid ibn al-Mughira'],
    elders: ['Abu Jahl (Amr b. Hisham)', 'Khalid ibn al-Walid (later)'],
    refs: [{ label: 'al-Walid (chief)', url: 'https://en.wikipedia.org/wiki/Walid_ibn_al-Mughira' }] },

  { id: 'sahm', name: 'Banu Sahm', group: 'Quraysh', x: 82, y: 36,
    elders: ['al-‘As ibn Wa’il', 'Amr ibn al-‘As'],
    refs: [{ label: 'al-‘As (elder)', url: 'https://en.wikipedia.org/wiki/Amr_ibn_al-As' }] },

  { id: 'umayya', name: 'Banu Umayya (ʿAbd Shams)', group: 'Quraysh', x: 72, y: 46,
    elders: ['Abu Sufyan ibn Harb'],
    refs: [{ label: 'Abu Sufyan (leader of opposition)', url: 'https://en.wikipedia.org/wiki/Abu_Sufyan_ibn_Harb' }] },

  // External contacts in Meccan phase
  { id: 'thaqif', name: 'Thaqif (Ta’if)', group: 'Taif', x: 50, y: 36,
    elders: ['ʿAbd Yalīl b. ʿAmr', 'Mas‘ud b. ʿAmr', 'Habib b. ʿAmr'],
    refs: [
      { label: 'Ta’if leaders', url: 'https://arqadhi.blogspot.com/2015/11/020-incident-of-ta.html' }
    ] },

  { id: 'aws', name: 'Aws (Yathrib)', group: 'Yathrib', x: 42, y: 58,
    elders: ['Abu al-Haytham b. al-Tayhan', 'Sa‘d b. Khaythama'],
    refs: [{ label: 'Aqaba participants', url: 'https://www.ashtoncentralmosque.com/app/uploads/2014/06/15.-The-Main-Pledge-of-Al-%E2%80%98Aqaba.pdf' }] },

  { id: 'khazraj', name: 'Khazraj (Yathrib)', group: 'Yathrib', x: 58, y: 58,
    elders: ['As‘ad b. Zurāra', 'al-Barāʾ b. Maʿrūr', 'Sa‘d b. ʿUbādah', 'ʿUbādah b. al-Ṣāmit'],
    refs: [
      { label: 'Second Pledge of Aqaba', url: 'https://en.wikipedia.org/wiki/Second_pledge_at_al-Aqabah' },
      { label: 'Aqaba list (pdf)', url: 'https://www.ashtoncentralmosque.com/app/uploads/2014/06/15.-The-Main-Pledge-of-Al-%E2%80%98Aqaba.pdf' }
    ] },

  // Tribes approached in Hajj seasons (Najd/Yamamah etc.)
  { id: 'amir', name: 'Banu ʿĀmir b. Saʿsaʿah', group: 'Najd', x: 18, y: 74,
    chiefs: ['Abu Barāʾ ʿĀmir ibn Mālik'],
    refs: [{ label: 'Fijar & chiefs', url: 'https://en.wikipedia.org/wiki/Fijar_Wars' }] },

  { id: 'hanifah', name: 'Banu Ḥanīfah (Yamāmah)', group: 'Najd', x: 34, y: 76 },

  { id: 'shayban', name: 'Banu Shaybān (Bakr)', group: 'Najd', x: 50, y: 76,
    elders: ['Mafruq b. ʿAmr', 'Haniʾ b. Qabīsa', 'al-Muthannā b. Ḥāritha', 'al-Nuʿmān b. Sharīk'],
    refs: [
      { label: 'Shaybān leaders (meeting)', url: 'https://preciousgemsfromthequranandsunnah.wordpress.com/2022/06/03/the-prophet-invites-the-other-arab-tribes-to-islam-authentic-seerah/' }
    ] },

  { id: 'kindah', name: 'Kindah', group: 'Najd', x: 66, y: 76 },

  { id: 'kalb', name: 'Banu Kalb', group: 'Najd', x: 82, y: 76 },

  // Ghatafan branches (pre-Islamic feud)
  { id: 'fazarah', name: 'Fazārah (Ghatafān)', group: 'Najd', x: 78, y: 66,
    elders: ['Hudhayfah b. Badr'],
    refs: [{ label: 'War of Dahis', url: 'https://en.wikipedia.org/wiki/Dahis_and_al-Ghabra' }] },

  { id: 'abs', name: 'ʿAbs (Ghatafān)', group: 'Najd', x: 90, y: 74,
    elders: ['Qays b. Zuhayr'],
    refs: [{ label: 'War of Dahis', url: 'https://en.wikipedia.org/wiki/Dahis_and_al-Ghabra' }] },
];

// Alliances (green) and Wars (red) among ONLY the tribes above
export const TRIBE_LINKS: TribeLink[] = [
  // Quraysh-internal alliances (without labeling “Hilf/Ahlaf”)
  { source: 'hashim', target: 'muttalib', kind: 'alliance' },
  { source: 'hashim', target: 'zuhra',    kind: 'alliance' },
  { source: 'hashim', target: 'taym',     kind: 'alliance' },
  { source: 'hashim', target: 'asad',     kind: 'alliance' },
  { source: 'makhzum', target: 'sahm',    kind: 'alliance' },
  { source: 'makhzum', target: 'umayya',  kind: 'alliance' },
  { source: 'sahm',    target: 'umayya',  kind: 'alliance' },

  // Pre-Islamic wars touching Mecca-phase interactions
  // Fijar War (Quraysh+Kinana vs Qays confed incl. Hawazin/Thaqif, Banu ‘Amir)
  { source: 'q', target: 'thaqif', kind: 'war', note: 'Fijar War (late 6th c.)' },
  { source: 'q', target: 'amir',   kind: 'war', note: 'Fijar War (late 6th c.)' },

  // Yathrib civil war before Islam
  { source: 'aws', target: 'khazraj', kind: 'war', note: 'Battle of Bu‘āth (pre-Hijrah)' },

  // Ghatafan internal feud (pre-Islamic) — both tribes were approached in Meccan phase lists
  { source: 'abs', target: 'fazarah', kind: 'war', note: 'War of Dāhis & al-Ghabrāʾ' },
];

/** TODO(back-end):
 * Replace this static file with GET /api/tribes?phase=meccan
 * Node fields to store: name, group (region), elders[], chiefs[], refs[], positions (x,y)
 * Link fields: {source, target, kind: 'alliance'|'war', note}
 */
