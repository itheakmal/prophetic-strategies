import { db } from '@/lib/db/client';

export async function getTribesGraph(phase = 'meccan') {
  const [nodes, links] = await Promise.all([
    db.tribe.findMany({
      where: { phase, deletedAt: null },
      orderBy: { name: 'asc' },
    }),
    db.tribeLink.findMany({
      where: { phase },
      include: { sourceTribe: true, targetTribe: true },
    }),
  ]);

  return {
    nodes: nodes.map(node => ({
      id: node.externalId,
      name: node.name,
      group: node.group,
      x: node.x,
      y: node.y,
      lat: node.lat,
      lon: node.lon,
      elders: node.elders ?? [],
      chiefs: node.chiefs ?? [],
      refs: node.refs ?? [],
    })),
    links: links.map(link => ({
      source: link.sourceTribe.externalId,
      target: link.targetTribe.externalId,
      kind: link.kind,
      note: link.note,
    })),
  };
}
