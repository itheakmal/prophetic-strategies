'use client';

import maplibregl, { Map } from 'maplibre-gl';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TribeNode, TribeLink } from '@/data/tribes';

type Props = {
  nodes: TribeNode[];
  links: TribeLink[];
  height?: number;
};

const STYLE = 'https://demotiles.maplibre.org/style.json'; // TODO: replace with your own style/tiles for prod

export default function ArabiaMap({ nodes, links, height = 560 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const [showAlliance, setShowAlliance] = useState(true);
  const [showWar, setShowWar] = useState(true);

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
              properties: { kind: l.kind, note: l.note || '' },
            };
          })
          .filter(Boolean),
      }) as geojson.FeatureCollection,
    [links, nodes]
  );

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: STYLE,
      center: [43, 23], // Arabia
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

      // Lines: alliance (green), war (red dashed)
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

      // Points: color by region group
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
            '#0ea5e9', // sky
            'Taif',
            '#f59e0b', // amber
            'Yathrib',
            '#22c55e', // green
            'Najd',
            '#6366f1', // indigo
            '#64748b', // slate
          ],
          'circle-stroke-color': '#111',
          'circle-stroke-width': 0.5,
        },
      });

      // Labels (may use default font from style)
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

      // Fit to bounds of nodes
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

      // Interactions
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
    });

    const onResize = () => map.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      map.remove();
      mapRef.current = null;
    };
  }, [lines, nodes, points]);

  // Update data & toggles without re-creating the map
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
  }, [points, lines, showAlliance, showWar]);

  return (
    <div className='rounded-2xl border border-stone-200 bg-white shadow-sm'>
      <div className='flex items-center justify-between gap-3 p-3 text-sm'>
        <div className='font-semibold text-stone-800'>
          Interactive Map — Arabia (Meccan phase)
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
