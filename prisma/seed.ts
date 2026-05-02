import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { hashPassword } from '../lib/auth/password';
import { mariadbAdapterUrlFromDatabaseUrl } from '../lib/db/mariadb-url';
import { EVENTS_DATA } from '../data/utils';
import { TRIBE_LINKS, TRIBE_NODES } from '../data/tribes';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required for seeding.');
}

const adapter = new PrismaMariaDb(mariadbAdapterUrlFromDatabaseUrl(connectionString));
const prisma = new PrismaClient({ adapter });

/** Public app login (`/api/auth/login`). Override with SEED_PUBLIC_USER_* in `.env`. */
const SEED_PUBLIC_USER_EMAIL =
  process.env.SEED_PUBLIC_USER_EMAIL?.trim().toLowerCase() ?? 'demo@example.com';
const SEED_PUBLIC_USER_PASSWORD = process.env.SEED_PUBLIC_USER_PASSWORD ?? 'password123';
const SEED_PUBLIC_USER_NAME = process.env.SEED_PUBLIC_USER_NAME ?? 'Demo reader';

async function main() {
  for (const [index, event] of EVENTS_DATA.entries()) {
    const savedEvent = await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        title: event.title,
        location: event.location,
        era: event.era,
        chronologyOrder: index,
        context: event.context,
        summary: event.summary,
        deeperPoints: event.deeper,
        lessons: event.lessons,
        parallels: event.parallels,
      },
      create: {
        slug: event.slug,
        title: event.title,
        location: event.location,
        era: event.era,
        chronologyOrder: index,
        context: event.context,
        summary: event.summary,
        deeperPoints: event.deeper,
        lessons: event.lessons,
        parallels: event.parallels,
      },
    });

    await prisma.eventQuote.deleteMany({ where: { eventId: savedEvent.id } });
    await prisma.eventMedia.deleteMany({ where: { eventId: savedEvent.id } });
    await prisma.eventFollowupQuestion.deleteMany({ where: { eventId: savedEvent.id } });

    if (event.quotes.length > 0) {
      await prisma.eventQuote.createMany({
        data: event.quotes.map((quote, quoteIndex) => ({
          eventId: savedEvent.id,
          subtitle: quote.subtitle,
          text: quote.text,
          source: quote.source,
          details: quote.details,
          sortOrder: quoteIndex,
        })),
      });
    }

    if (event.media.length > 0) {
      await prisma.eventMedia.createMany({
        data: event.media.map((media, mediaIndex) => ({
          eventId: savedEvent.id,
          type: media.type,
          src: media.src,
          alt: media.alt,
          poster: media.poster,
          sortOrder: mediaIndex,
        })),
      });
    }

    if (event.followups) {
      await prisma.eventFollowupQuestion.createMany({
        data: [
          {
            eventId: savedEvent.id,
            questionType: 'action',
            prompt: event.followups.action.prompt,
            inputType: event.followups.action.type,
            choices: event.followups.action.choices,
            correctIndex: event.followups.action.correctIndex,
            explanation: event.followups.action.explanation,
            sortOrder: 0,
          },
          {
            eventId: savedEvent.id,
            questionType: 'reaction',
            prompt: event.followups.reaction.prompt,
            inputType: event.followups.reaction.type,
            choices: event.followups.reaction.choices,
            correctIndex: event.followups.reaction.correctIndex,
            explanation: event.followups.reaction.explanation,
            sortOrder: 1,
          },
        ],
      });
    }
  }

  for (const node of TRIBE_NODES) {
    await prisma.tribe.upsert({
      where: { externalId: node.id },
      update: {
        name: node.name,
        group: node.group,
        x: node.x,
        y: node.y,
        lat: node.lat,
        lon: node.lon,
        elders: node.elders ?? [],
        chiefs: node.chiefs ?? [],
        refs: node.refs ?? [],
      },
      create: {
        externalId: node.id,
        name: node.name,
        group: node.group,
        phase: 'meccan',
        x: node.x,
        y: node.y,
        lat: node.lat,
        lon: node.lon,
        elders: node.elders ?? [],
        chiefs: node.chiefs ?? [],
        refs: node.refs ?? [],
      },
    });
  }

  await prisma.tribeLink.deleteMany({ where: { phase: 'meccan' } });
  for (const link of TRIBE_LINKS) {
    const source = await prisma.tribe.findUnique({ where: { externalId: link.source } });
    const target = await prisma.tribe.findUnique({ where: { externalId: link.target } });

    if (!source || !target) continue;

    await prisma.tribeLink.create({
      data: {
        sourceTribeId: source.id,
        targetTribeId: target.id,
        kind: link.kind,
        note: link.note,
        phase: 'meccan',
      },
    });
  }

  const passwordHash = hashPassword(SEED_PUBLIC_USER_PASSWORD);

  await prisma.user.upsert({
    where: { email: SEED_PUBLIC_USER_EMAIL },
    update: {
      name: SEED_PUBLIC_USER_NAME,
      passwordHash,
      deletedAt: null,
      role: 'EDITOR',
    },
    create: {
      email: SEED_PUBLIC_USER_EMAIL,
      name: SEED_PUBLIC_USER_NAME,
      role: 'EDITOR',
      passwordHash,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
