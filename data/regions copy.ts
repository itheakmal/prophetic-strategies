// data/regions.ts
export type Region = {
  id: string;
  name: string;
  color?: string;            // map fill color
  members: string[];         // tribe node IDs included in this region
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [ [ [lon,lat], ...closed ] ]
  };
};

// Simple bounding-box polygon around Makkah (tweak as you like)
const MECCA_BOX: number[][] = [
  [39.7979, 21.3391], // SW
  [39.9179, 21.3391], // SE
  [39.9179, 21.4391], // NE
  [39.7979, 21.4391], // NW
  [39.7979, 21.3391], // close
];

export const REGIONS: Region[] = [
  {
    id: 'mecca',
    name: 'Makkah (Quraysh)',
    color: '#fde68a', // amber-200
    members: [
      'q',          // Quraysh (collective)
      'hashim', 'muttalib', 'zuhra', 'taym', 'asad',
      'makhzum', 'sahm', 'umayya',
    ],
    geometry: {
      type: 'Polygon',
      coordinates: [MECCA_BOX],
    },
  },

  // 👇 Add more regions later (Yathrib/Medina, Ta’if, etc.)
  // {
  //   id: 'yathrib',
  //   name: 'Yathrib (Aws & Khazraj)',
  //   color: '#bbf7d0',
  //   members: ['aws', 'khazraj'],
  //   geometry: { type: 'Polygon', coordinates: [/* your ring */] }
  // },
];

/** TODO(back-end):
 * Store regions in DB (id, name, color, members[], polygon geojson).
 * API: GET /api/regions?phase=meccan -> Region[]
 * Map loads regions + toggles interactions; inner graph uses members[].
 */
