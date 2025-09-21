// data/regions.ts
export type Region = {
  id: string;
  name: string;
  color?: string;
  members: string[]; // tribe node IDs included in this region
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [ [ [lon,lat], ...closed ] ]
  };
  // NEW: optional intra-city subregions (e.g., Makkah quarters)
  subregions?: {
    id: string;
    name: string;
    tribeId: string;                // node id this subregion represents
    certainty: 'attested' | 'inferred' | 'illustrative';
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];    // [ [ [lon,lat]... closed ] ]
    };
    notes?: string;
  }[];
};

// --- Accurate city anchor around Masjid al-Haram (rough bounding ring) ---
// Center: Ka'bah 21.422487, 39.826206  (source latlong.net)
// We build a small rectangle around the historic core to click/zoom.
// Feel free to tweak padding if tiles/styles differ on your machine.
const MAKKAH_CORE: number[][] = [
  [39.8228, 21.4200], // SW
  [39.8302, 21.4200], // SE
  [39.8302, 21.4252], // NE
  [39.8228, 21.4252], // NW
  [39.8228, 21.4200], // close
];

// --- Shiʿb Abī Ṭālib (Banū Hāshim) ---
// Described as behind Safa–Marwah, between Jabal Abu Qubays (E of Haram)
// and Jabal Khandama. We draw a small polygon NE/E of the Masʿa corridor.
// *Approximate* ring chosen from those coordinates and satellite cues.
const SHIB_ABI_TALIB: number[][] = [
  [39.8296, 21.4236],
  [39.8307, 21.4236],
  [39.8309, 21.4246],
  [39.8298, 21.4248],
  [39.8296, 21.4236],
];

// --- Illustrative subregions for other Quraysh clans ---
// These are clearly marked 'illustrative' until you replace with vetted shapes.
// They keep clusters near well-known quarters (Ajyad south, Shubaikah west/NW, etc.)
// so markers don’t overlap; refine with a historian later.
const MAKHZUM_AJYAD: number[][] = [
  [39.8268, 21.4202],
  [39.8290, 21.4202],
  [39.8292, 21.4216],
  [39.8266, 21.4216],
  [39.8268, 21.4202],
];

const UMAYYA_WSW: number[][] = [
  [39.8238, 21.4216],
  [39.8258, 21.4216],
  [39.8258, 21.4228],
  [39.8236, 21.4228],
  [39.8238, 21.4216],
];

const SAHM_W: number[][] = [
  [39.8248, 21.4230],
  [39.8266, 21.4230],
  [39.8266, 21.4240],
  [39.8246, 21.4240],
  [39.8248, 21.4230],
];

const ZUHRA_NW: number[][] = [
  [39.8242, 21.4242],
  [39.8262, 21.4242],
  [39.8264, 21.4250],
  [39.8240, 21.4250],
  [39.8242, 21.4242],
];

const TAYM_SW: number[][] = [
  [39.8240, 21.4204],
  [39.8256, 21.4204],
  [39.8258, 21.4212],
  [39.8238, 21.4212],
  [39.8240, 21.4204],
];

const ASAD_SSE: number[][] = [
  [39.8288, 21.4216],
  [39.8301, 21.4216],
  [39.8302, 21.4225],
  [39.8286, 21.4225],
  [39.8288, 21.4216],
];

export const REGIONS: Region[] = [
  {
    id: 'mecca',
    name: 'Makkah (Quraysh)',
    color: '#fde68a',
    members: [
      'q',
      'hashim', 'muttalib', 'zuhra', 'taym', 'asad',
      'makhzum', 'sahm', 'umayya',
    ],
    geometry: { type: 'Polygon', coordinates: [MAKKAH_CORE] },
    subregions: [
      {
        id: 'hashim-shib',
        name: "Shiʿb Abī Ṭālib (Banū Hāshim)",
        tribeId: 'hashim',
        certainty: 'attested',
        geometry: { type: 'Polygon', coordinates: [SHIB_ABI_TALIB] },
        notes:
          "Valley behind Ṣafā–Marwah, between Jabal Abū Qubays and Jabal Khandama; site of the boycott refuge.",
      },
      {
        id: 'makhzum-ajyad',
        name: "Banū Makhzūm (Ajyad cluster — illustrative)",
        tribeId: 'makhzum',
        certainty: 'illustrative',
        geometry: { type: 'Polygon', coordinates: [MAKHZUM_AJYAD] },
      },
      {
        id: 'umayya-wsw',
        name: "Banū Umayya (WSW cluster — illustrative)",
        tribeId: 'umayya',
        certainty: 'illustrative',
        geometry: { type: 'Polygon', coordinates: [UMAYYA_WSW] },
      },
      {
        id: 'sahm-w',
        name: "Banū Sahm (W cluster — illustrative)",
        tribeId: 'sahm',
        certainty: 'illustrative',
        geometry: { type: 'Polygon', coordinates: [SAHM_W] },
      },
      {
        id: 'zuhra-nw',
        name: "Banū Zuhra (NW cluster — illustrative)",
        tribeId: 'zuhra',
        certainty: 'illustrative',
        geometry: { type: 'Polygon', coordinates: [ZUHRA_NW] },
      },
      {
        id: 'taym-sw',
        name: "Banū Taym (SW cluster — illustrative)",
        tribeId: 'taym',
        certainty: 'illustrative',
        geometry: { type: 'Polygon', coordinates: [TAYM_SW] },
      },
      {
        id: 'asad-sse',
        name: "Banū Asad (S–SE cluster — illustrative)",
        tribeId: 'asad',
        certainty: 'illustrative',
        geometry: { type: 'Polygon', coordinates: [ASAD_SSE] },
      },
      // Add Banū al-Muṭṭalib later if you want a distinct polygon:
      // { id: 'muttalib-...', name: 'Banū al-Muṭṭalib (...)', tribeId: 'muttalib', ... }
    ],
  },
];
