'use client';

import maplibregl, { Map } from 'maplibre-gl';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TribeNode, TribeLink } from '@/data/tribes';
import { REGIONS } from '@/data/regions';

type Props = {
  nodes: TribeNode[];
  links: TribeLink[];
  height?: number;
};

const STYLE = 'https://demotiles.maplibre.org/style.json'; // dev tiles; swap for prod style

type BBox = [[number, number], [number, number]]; // [[minLon,minLat],[maxLon,maxLat]]

function polygonBounds(coords: number[][][]): BBox {
  let minLon = +Infinity,
    minLat = +Infinity,
    maxLon = -Infinity,
    maxLat = -Infinity;
  for (const ring of coords) {
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lat < minLat) minLat = lat;
      if (lon > maxLon) maxLon = lon;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return [
    [minLon, minLat],
    [maxLon, maxLat],
  ];
}

export default function ArabiaMap({ nodes, links, height = 560 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const [showAlliance, setShowAlliance] = useState(true);
  const [showWar, setShowWar] = useState(true);

  const [focusedRegionId, setFocusedRegionId] = useState<string | null>(null);
  const focusedRegion = REGIONS.find(r => r.id === focusedRegionId);
  const focusedSet = new Set(focusedRegion?.members ?? []);

  // ---- GeoJSON sources
  const points = useMemo(
    () =>
      ({
        type: 'FeatureCollection',
        features: nodes.map(n => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [n.lon, n.lat] },
          properties: {
            id: n.id,
            name: n.name,
            group: n.group,
            chiefs: (n.chiefs || []).join(' • '),
            elders: (n.elders || []).join(' • '),
            refs: JSON.stringify(n.refs || []),
          },
        })),
      }) as geojson.FeatureCollection,
    [nodes]
  );

  const lines = useMemo(
    () =>
      ({
        type: 'FeatureCollection',
        features: links
          .map(l => {
            const a = nodes.find(n => n.id === l.source);
            const b = nodes.find(n => n.id === l.target);
            if (!a || !b) return null;
            return {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  [a.lon, a.lat],
                  [b.lon, b.lat],
                ],
              },
              properties: {
                kind: l.kind,
                note: l.note || '',
                sourceId: a.id,
                targetId: b.id,
              },
            };
          })
          .filter(Boolean),
      }) as geojson.FeatureCollection,
    [links, nodes]
  );

  const regions = useMemo(
    () =>
      ({
        type: 'FeatureCollection',
        features: REGIONS.map(r => ({
          type: 'Feature',
          geometry: r.geometry,
          properties: {
            id: r.id,
            name: r.name,
            color: r.color || '#fde68a',
            members: JSON.stringify(r.members),
          },
        })),
      }) as geojson.FeatureCollection,
    []
  );

  // ---- Init map
  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: STYLE,
      center: [43, 23],
      zoom: 5.1,
      attributionControl: true,
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      'top-right'
    );
    mapRef.current = map;

    map.on('load', () => {
      map.addSource('tribe-points', { type: 'geojson', data: points });
      map.addSource('tribe-lines', { type: 'geojson', data: lines });
      map.addSource('tribe-regions', { type: 'geojson', data: regions });

      // --- Regions (fill + outline + label)
      map.addLayer({
        id: 'regions-fill',
        type: 'fill',
        source: 'tribe-regions',
        paint: {
          'fill-color': ['coalesce', ['get', 'color'], '#fde68a'],
          'fill-opacity': 0.25,
        },
      });
      map.addLayer({
        id: 'regions-outline',
        type: 'line',
        source: 'tribe-regions',
        paint: { 'line-color': '#f59e0b', 'line-width': 2 },
      });
      map.addLayer({
        id: 'regions-label',
        type: 'symbol',
        source: 'tribe-regions',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 12,
        },
        paint: { 'text-color': '#92400e' },
      });

      // --- Global links
      map.addLayer({
        id: 'links-alliance',
        type: 'line',
        source: 'tribe-lines',
        filter: ['==', ['get', 'kind'], 'alliance'],
        paint: { 'line-color': '#10b981', 'line-width': 2 },
      });
      map.addLayer({
        id: 'links-war',
        type: 'line',
        source: 'tribe-lines',
        filter: ['==', ['get', 'kind'], 'war'],
        paint: {
          'line-color': '#ef4444',
          'line-width': 3,
          'line-dasharray': [2, 2],
        },
      });

      // --- Global points + labels
      map.addLayer({
        id: 'tribe-circles',
        type: 'circle',
        source: 'tribe-points',
        paint: {
          'circle-radius': 5,
          'circle-color': [
            'match',
            ['get', 'group'],
            'Quraysh',
            '#0ea5e9',
            'Taif',
            '#f59e0b',
            'Yathrib',
            '#22c55e',
            'Najd',
            '#6366f1',
            '#64748b',
          ],
          'circle-stroke-color': '#111',
          'circle-stroke-width': 0.5,
          'circle-opacity': 0.95,
        },
      });
      map.addLayer({
        id: 'tribe-labels',
        type: 'symbol',
        source: 'tribe-points',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
        },
        paint: { 'text-color': '#334155' },
      });

      // --- Focused region overlays (inner graph)
      // Inner links: alliances between members only
      map.addLayer({
        id: 'links-inner',
        type: 'line',
        source: 'tribe-lines',
        filter: [
          'all',
          ['==', ['get', 'kind'], 'alliance'],
          ['in', ['get', 'sourceId'], ['literal', []]],
          ['in', ['get', 'targetId'], ['literal', []]],
        ],
        paint: { 'line-color': '#065f46', 'line-width': 3 },
      });

      // Focused nodes: members only (bigger)
      map.addLayer({
        id: 'tribe-circles-focus',
        type: 'circle',
        source: 'tribe-points',
        filter: ['in', ['get', 'id'], ['literal', []]],
        paint: {
          'circle-radius': 7.5,
          'circle-color': '#f59e0b',
          'circle-stroke-color': '#111',
          'circle-stroke-width': 0.8,
        },
      });

      // Interactions
      map.on('mouseenter', 'regions-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'regions-fill', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', 'regions-fill', e => {
        const f = e.features?.[0];
        if (!f) return;
        const pid = f.properties?.id as string;
        const region = REGIONS.find(r => r.id === pid);
        if (!region) return;

        // Zoom to region bounds
        const bbox = polygonBounds((f.geometry as any).coordinates);
        map.fitBounds(bbox, { padding: 60 });
        setFocusedRegionId(region.id);
      });

      // Point click -> popup
      map.on('mouseenter', 'tribe-circles', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'tribe-circles', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', 'tribe-circles', e => {
        const f = e.features?.[0];
        if (!f) return;
        const p = f.properties as any;
        const refs = JSON.parse(p.refs || '[]') as {
          label: string;
          url: string;
        }[];
        const html = `
          <div style="max-width:280px">
            <div style="font-weight:600;color:#111827">${p.name}</div>
            ${p.chiefs ? `<div><b>Chiefs:</b> ${p.chiefs}</div>` : ''}
            ${p.elders ? `<div><b>Elders:</b> ${p.elders}</div>` : ''}
            ${
              refs.length
                ? `<div style="margin-top:6px;font-size:12px;color:#334155"><b>Citations</b><ul>${refs
                    .map(
                      r =>
                        `<li><a href="${r.url}" target="_blank" rel="noreferrer" style="color:#1d4ed8">${r.label}</a></li>`
                    )
                    .join('')}</ul></div>`
                : ''
            }
          </div>
        `;
        new maplibregl.Popup({ closeOnClick: true })
          .setLngLat((e as any).lngLat)
          .setHTML(html)
          .addTo(map);
      });

      // Fit initial extent to all nodes
      const lons = nodes.map(n => n.lon),
        lats = nodes.map(n => n.lat);
      const minLon = Math.min(...lons),
        maxLon = Math.max(...lons);
      const minLat = Math.min(...lats),
        maxLat = Math.max(...lats);
      map.fitBounds(
        [
          [minLon, minLat],
          [maxLon, maxLat],
        ],
        { padding: 50, animate: false }
      );
    });

    const onResize = () => map.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      map.remove();
      mapRef.current = null;
    };
  }, [lines, nodes, regions]);

  // ---- Update live data + toggles + focus
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    (map.getSource('tribe-points') as any)?.setData(points);
    (map.getSource('tribe-lines') as any)?.setData(lines);

    map.setLayoutProperty(
      'links-alliance',
      'visibility',
      showAlliance ? 'visible' : 'none'
    );
    map.setLayoutProperty(
      'links-war',
      'visibility',
      showWar ? 'visible' : 'none'
    );

    // Focus filters for inner graph
    const members = focusedRegion?.members ?? [];
    map.setFilter('tribe-circles-focus', [
      'in',
      ['get', 'id'],
      ['literal', members],
    ]);
    map.setFilter('links-inner', [
      'all',
      ['==', ['get', 'kind'], 'alliance'],
      ['in', ['get', 'sourceId'], ['literal', members]],
      ['in', ['get', 'targetId'], ['literal', members]],
    ]);

    // Dim global circles when focused
    map.setPaintProperty(
      'tribe-circles',
      'circle-opacity',
      focusedRegion ? 0.25 : 0.95
    );
    map.setLayoutProperty(
      'regions-label',
      'visibility',
      focusedRegion ? 'none' : 'visible'
    );
  }, [points, lines, showAlliance, showWar, focusedRegion]);

  // ---- Reset button
  function resetFocus() {
    const map = mapRef.current;
    setFocusedRegionId(null);
    if (!map) return;
    const lons = nodes.map(n => n.lon),
      lats = nodes.map(n => n.lat);
    const minLon = Math.min(...lons),
      maxLon = Math.max(...lons);
    const minLat = Math.min(...lats),
      maxLat = Math.max(...lats);
    map.fitBounds(
      [
        [minLon, minLat],
        [maxLon, maxLat],
      ],
      { padding: 50 }
    );
  }

  return (
    <div className='rounded-2xl border border-stone-200 bg-white shadow-sm'>
      <div className='flex flex-wrap items-center justify-between gap-3 p-3 text-sm'>
        <div className='font-semibold text-stone-800'>
          Interactive Map — Arabia (Meccan phase)
          {focusedRegion && (
            <span className='ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-amber-800'>
              Focus: {focusedRegion.name}
            </span>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <label className='flex items-center gap-1'>
            <input
              type='checkbox'
              checked={showAlliance}
              onChange={e => setShowAlliance(e.target.checked)}
            />
            <span>Alliances</span>
          </label>
          <label className='flex items-center gap-1'>
            <input
              type='checkbox'
              checked={showWar}
              onChange={e => setShowWar(e.target.checked)}
            />
            <span>Wars</span>
          </label>
          {focusedRegion && (
            <button
              onClick={resetFocus}
              className='rounded-md border border-stone-300 px-2 py-1 hover:bg-stone-100'
            >
              Reset View
            </button>
          )}
        </div>
      </div>
      <div
        ref={ref}
        style={{ height }}
        className='w-full overflow-hidden rounded-b-2xl'
      />
    </div>
  );
}
