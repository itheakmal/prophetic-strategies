// components/TribeGraph.tsx
'use client';

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TribeNode, TribeLink } from '@/data/tribes';

type Props = { nodes: TribeNode[]; links: TribeLink[]; height?: number };

const COLORS = {
  node: {
    Quraysh: '#0ea5e9', // sky
    Taif: '#f59e0b',    // amber
    Yathrib: '#22c55e', // green
    Najd: '#6366f1',    // indigo
  },
  edge: {
    alliance: '#10b981', // green
    war: '#ef4444',      // red
  }
};

export default function TribeGraph({ nodes, links, height = 540 }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: TribeNode } | null>(null);
  const [selected, setSelected] = useState<TribeNode | null>(null);

  const view = { w: 960, h: height };
  const byId = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.6, 4])
      .on('zoom', (e) => d3.select(gRef.current).attr('transform', e.transform.toString()));
    d3.select(svgRef.current).call(zoom as any);
    return () => d3.select(svgRef.current).on('.zoom', null);
  }, []);

  const X = (n: TribeNode) => (n.x / 100) * view.w;
  const Y = (n: TribeNode) => (n.y / 100) * view.h;

  return (
    <div className="relative rounded-2xl border border-stone-200 bg-white shadow-sm">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${view.w} ${view.h}`}
        width="100%"
        height={height}
        className="block rounded-2xl"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <marker id="arrowAlliance" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.edge.alliance} />
          </marker>
          <marker id="arrowWar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.edge.war} />
          </marker>
        </defs>

        <g ref={gRef}>
          {/* edges */}
          {links.map((l, idx) => {
            const a = byId.get(l.source);
            const b = byId.get(l.target);
            if (!a || !b) return null;
            const stroke = l.kind === 'war' ? COLORS.edge.war : COLORS.edge.alliance;
            const dash = l.kind === 'war' ? '6,4' : undefined;
            const marker = l.kind === 'war' ? 'url(#arrowWar)' : 'url(#arrowAlliance)';
            return (
              <g key={idx}>
                <line
                  x1={X(a)} y1={Y(a)} x2={X(b)} y2={Y(b)}
                  stroke={stroke} strokeWidth={l.kind === 'war' ? 3 : 2}
                  strokeDasharray={dash} markerEnd={marker} opacity={0.9}
                />
                {l.note && (
                  <text
                    x={(X(a) + X(b)) / 2}
                    y={(Y(a) + Y(b)) / 2 - 6}
                    textAnchor="middle"
                    style={{ fontSize: 10, fill: '#475569' }}
                  >
                    {l.note}
                  </text>
                )}
              </g>
            );
          })}

          {/* nodes */}
          {nodes.map((n) => {
            const fill = COLORS.node[n.group] ?? '#64748b';
            return (
              <g key={n.id}
                 transform={`translate(${X(n)},${Y(n)})`}
                 tabIndex={0}
                 onClick={() => setSelected(n)}
                 onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, node: n })}
                 onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY, node: n })}
                 onMouseLeave={() => setTooltip(null)}
                 className="cursor-pointer">
                <circle r={12} fill={fill} stroke="#111" strokeWidth={0.5} />
                <text x={0} y={-18} textAnchor="middle" className="select-none" style={{ fontSize: 11, fill: '#334155' }}>
                  {n.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* legend */}
      <div className="absolute left-3 top-3 rounded-md bg-white/90 p-2 text-xs shadow ring-1 ring-stone-200">
        <div className="mb-1 font-semibold text-stone-700">Legend</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <LegendDot color={COLORS.node.Quraysh} label="Quraysh clans" />
          <LegendDot color={COLORS.node.Taif} label="Ta’if region" />
          <LegendDot color={COLORS.node.Yathrib} label="Yathrib" />
          <LegendDot color={COLORS.node.Najd} label="Najd/Yamāmah" />
          <LegendLine color={COLORS.edge.alliance} label="Alliance" />
          <LegendLine color={COLORS.edge.war} label="War/Feud (pre-Islamic)" dash />
        </div>
      </div>

      {/* tooltip */}
      {!!tooltip && (
        <div
          className="pointer-events-none absolute z-10 w-72 max-w-[80vw] rounded-md border border-stone-200 bg-white p-2 text-xs shadow"
          style={{ left: tooltip.x + 12, top: tooltip.y - 24 }}
        >
          <div className="font-semibold text-stone-800">{tooltip.node.name}</div>
          {tooltip.node.chiefs?.length ? (
            <div className="mt-1 text-stone-700"><span className="font-medium">Chiefs:</span> {tooltip.node.chiefs.join(', ')}</div>
          ) : null}
          {tooltip.node.elders?.length ? (
            <div className="mt-1 text-stone-700"><span className="font-medium">Elders/Notables:</span> {tooltip.node.elders.join(', ')}</div>
          ) : null}
          {tooltip.node.refs?.length ? (
            <ul className="mt-1 list-disc pl-5">
              {tooltip.node.refs.map((r, i) => (
                <li key={i}><a className="text-blue-700 hover:underline" href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

      {/* details panel */}
      {selected && (
        <div className="border-t border-stone-200 p-3 text-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base font-semibold text-stone-900">{selected.name}</div>
              <div className="text-stone-600">Region: {selected.group}</div>
            </div>
            <button
              className="rounded-md border border-stone-300 px-2 py-1 text-xs hover:bg-stone-100"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
          {selected.chiefs?.length ? <p className="mt-2">Chiefs: {selected.chiefs.join(', ')}</p> : null}
          {selected.elders?.length ? <p className="mt-1">Elders/Notables: {selected.elders.join(', ')}</p> : null}
          {selected.refs?.length ? (
            <div className="mt-2">
              <div className="text-xs font-medium text-stone-500">Citations</div>
              <ul className="mt-1 list-disc pl-5">
                {selected.refs.map((r, i) => (
                  <li key={i}><a className="text-blue-700 hover:underline" href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-stone-700">{label}</span>
    </span>
  );
}
function LegendLine({ color, label, dash }: { color: string; label: string; dash?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-block h-0.5 w-5" style={{ backgroundColor: color, borderTop: dash ? '1px dashed '+color : undefined }} />
      <span className="text-stone-700">{label}</span>
    </span>
  );
}
