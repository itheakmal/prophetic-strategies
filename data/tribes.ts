// data/tribes.ts  (only the type + nodes changed; links unchanged)
export type TribeRef = { label: string; url: string };

export type TribeNode = {
  id: string;
  name: string;
  group: 'Quraysh' | 'Taif' | 'Yathrib' | 'Najd';
  // existing canvas positions (keep if you still use the SVG graph):
  x: number;
  y: number;
  // NEW: map coordinates (approximate; refine with historical atlas)
  lat: number;
  lon: number;
  elders?: string[];
  chiefs?: string[];
  refs?: TribeRef[];
};

export type TribeLink = {
  source: string;
  target: string;
  kind: 'alliance' | 'war';
  note?: string;
};

// ----------- NODES (with lat/lon) -----------
export const TRIBE_NODES: TribeNode[] = [
  // Mecca cluster (slight jitter around Mecca so markers don’t stack)
  {
    id: 'q',
    name: 'Quraysh (collective)',
    group: 'Quraysh',
    x: 50,
    y: 8,
    lat: 21.3891,
    lon: 39.8579,
  },

  {
    id: 'hashim',
    name: 'Banu Hashim',
    group: 'Quraysh',
    x: 20,
    y: 24,
    lat: 21.392,
    lon: 39.858,
    chiefs: ['Abu Talib ibn Abd al-Muttalib'],
    elders: ['Abd al-Muttalib (earlier)', 'Abu Lahab (later)'],
    refs: [
      {
        label: 'Abu Talib (chief)',
        url: 'https://en.wikipedia.org/wiki/Abu_Talib_ibn_Abd_al-Muttalib',
      },
    ],
  },

  {
    id: 'muttalib',
    name: 'Banu Muttalib',
    group: 'Quraysh',
    x: 32,
    y: 28,
    lat: 21.395,
    lon: 39.854,
  },

  {
    id: 'zuhra',
    name: 'Banu Zuhra',
    group: 'Quraysh',
    x: 28,
    y: 38,
    lat: 21.388,
    lon: 39.852,
    elders: ['Sa‘d ibn Abi Waqqas', '‘Abd al-Rahman ibn ‘Awf'],
  },

  {
    id: 'taym',
    name: 'Banu Taym',
    group: 'Quraysh',
    x: 18,
    y: 44,
    lat: 21.386,
    lon: 39.861,
    elders: ['Abu Bakr as-Siddiq'],
  },

  {
    id: 'asad',
    name: 'Banu Asad',
    group: 'Quraysh',
    x: 36,
    y: 46,
    lat: 21.384,
    lon: 39.856,
    elders: [
      'Khuwaylid ibn Asad',
      'Khadijah bint Khuwaylid',
      'Zubayr ibn al-Awwam',
    ],
  },

  {
    id: 'makhzum',
    name: 'Banu Makhzum',
    group: 'Quraysh',
    x: 68,
    y: 28,
    lat: 21.391,
    lon: 39.864,
    chiefs: ['al-Walid ibn al-Mughira'],
    elders: ['Abu Jahl (Amr b. Hisham)', 'Khalid ibn al-Walid (later)'],
    refs: [
      {
        label: 'al-Walid (chief)',
        url: 'https://en.wikipedia.org/wiki/Walid_ibn_al-Mughira',
      },
    ],
  },

  {
    id: 'sahm',
    name: 'Banu Sahm',
    group: 'Quraysh',
    x: 82,
    y: 36,
    lat: 21.382,
    lon: 39.862,
    elders: ['al-‘As ibn Wa’il', 'Amr ibn al-‘As'],
    refs: [
      {
        label: 'al-‘As (elder)',
        url: 'https://en.wikipedia.org/wiki/Amr_ibn_al-As',
      },
    ],
  },

  {
    id: 'umayya',
    name: 'Banu Umayya (ʿAbd Shams)',
    group: 'Quraysh',
    x: 72,
    y: 46,
    lat: 21.387,
    lon: 39.849,
    elders: ['Abu Sufyan ibn Harb'],
    refs: [
      {
        label: 'Abu Sufyan (leader)',
        url: 'https://en.wikipedia.org/wiki/Abu_Sufyan_ibn_Harb',
      },
    ],
  },

  // Ta’if
  {
    id: 'thaqif',
    name: 'Thaqif (Ta’if)',
    group: 'Taif',
    x: 50,
    y: 36,
    lat: 21.2703,
    lon: 40.4158,
    elders: ['ʿAbd Yalīl b. ʿAmr', 'Mas‘ud b. ʿAmr', 'Habib b. ʿAmr'],
  },

  // Yathrib / Medina (slight separation so markers don’t overlap)
  {
    id: 'aws',
    name: 'Aws (Yathrib)',
    group: 'Yathrib',
    x: 42,
    y: 58,
    lat: 24.47,
    lon: 39.61,
    elders: ['Abu al-Haytham b. al-Tayhan', 'Sa‘d b. Khaythama'],
  },

  {
    id: 'khazraj',
    name: 'Khazraj (Yathrib)',
    group: 'Yathrib',
    x: 58,
    y: 58,
    lat: 24.5,
    lon: 39.58,
    elders: [
      'As‘ad b. Zurāra',
      'al-Barāʾ b. Maʿrūr',
      'Sa‘d b. ʿUbādah',
      'ʿUbādah b. al-Ṣāmit',
    ],
  },

  // Najd / Yamāmah / North
  {
    id: 'amir',
    name: 'Banu ʿĀmir b. Saʿsaʿah',
    group: 'Najd',
    x: 18,
    y: 74,
    lat: 22.5,
    lon: 43.7,
    chiefs: ['Abu Barāʾ ʿĀmir ibn Mālik'],
  },

  {
    id: 'hanifah',
    name: 'Banu Ḥanīfah (Yamāmah)',
    group: 'Najd',
    x: 34,
    y: 76,
    lat: 24.7136,
    lon: 46.6753,
  },

  {
    id: 'shayban',
    name: 'Banu Shaybān (Bakr)',
    group: 'Najd',
    x: 50,
    y: 76,
    lat: 31.5,
    lon: 45.0,
    elders: [
      'Mafruq b. ʿAmr',
      'Haniʾ b. Qabīsa',
      'al-Muthannā b. Ḥāritha',
      'al-Nuʿmān b. Sharīk',
    ],
  },

  {
    id: 'kindah',
    name: 'Kindah',
    group: 'Najd',
    x: 66,
    y: 76,
    lat: 19.75,
    lon: 45.1,
  },

  {
    id: 'kalb',
    name: 'Banu Kalb',
    group: 'Najd',
    x: 82,
    y: 76,
    lat: 29.81,
    lon: 39.87,
  },

  {
    id: 'fazarah',
    name: 'Fazārah (Ghatafān)',
    group: 'Najd',
    x: 78,
    y: 66,
    lat: 27.52,
    lon: 41.69,
    elders: ['Hudhayfah b. Badr'],
  },

  {
    id: 'abs',
    name: 'ʿAbs (Ghatafān)',
    group: 'Najd',
    x: 90,
    y: 74,
    lat: 27.1,
    lon: 42.0,
    elders: ['Qays b. Zuhayr'],
  },
];

// ----------- LINKS (unchanged) -----------
export const TRIBE_LINKS: TribeLink[] = [
  { source: 'hashim', target: 'muttalib', kind: 'alliance' },
  { source: 'hashim', target: 'zuhra', kind: 'alliance' },
  { source: 'hashim', target: 'taym', kind: 'alliance' },
  { source: 'hashim', target: 'asad', kind: 'alliance' },
  { source: 'makhzum', target: 'sahm', kind: 'alliance' },
  { source: 'makhzum', target: 'umayya', kind: 'alliance' },
  { source: 'sahm', target: 'umayya', kind: 'alliance' },

  {
    source: 'q',
    target: 'thaqif',
    kind: 'war',
    note: 'Fijar War (late 6th c.)',
  },
  { source: 'q', target: 'amir', kind: 'war', note: 'Fijar War (late 6th c.)' },

  {
    source: 'aws',
    target: 'khazraj',
    kind: 'war',
    note: 'Battle of Bu‘āth (pre-Hijrah)',
  },

  {
    source: 'abs',
    target: 'fazarah',
    kind: 'war',
    note: 'War of Dāhis & al-Ghabrāʾ',
  },
];

/** TODO(back-end):
 * Store lat/lon in DB. API => GET /api/tribes?phase=meccan with {nodes,links}.
 * Allow new tribes by appending node(s) with lat/lon and link(s) with kind + note.
 */
