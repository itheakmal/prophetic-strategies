import { db } from '@/lib/db/client';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireAdmin } from '@/lib/auth/admin';
import { createEventSchema } from '@/lib/validation/event';
import { ZodError } from 'zod';

function normalizeEventPayload(raw: unknown) {
  const payload = (raw ?? {}) as Record<string, any>;

  if (Array.isArray(payload.quotes)) {
    payload.quotes = payload.quotes.map((q: Record<string, any>) => ({
      ...q,
      details: q?.details === '' ? undefined : q?.details,
    }));
  }

  if (Array.isArray(payload.media)) {
    payload.media = payload.media.map((m: Record<string, any>) => ({
      ...m,
      alt: m?.alt === '' ? undefined : m?.alt,
      poster: m?.poster === '' ? undefined : m?.poster,
    }));
  }

  return payload;
}

export async function GET() {
  try {
    await requireAdmin();
    const events = await db.event.findMany({ orderBy: { chronologyOrder: 'asc' } });
    return successResponse(events);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Admin authentication required'));
    }
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = createEventSchema.parse(normalizeEventPayload(await request.json()));

    const event = await db.event.create({
      data: {
        slug: payload.slug,
        title: payload.title,
        location: payload.location,
        era: payload.era,
        context: payload.context,
        summary: payload.summary,
        chronologyOrder: payload.chronologyOrder ?? 0,
        deeperPoints: payload.deeper,
        lessons: payload.lessons,
        parallels: payload.parallels,
      },
    });

    if (payload.quotes.length) {
      await db.eventQuote.createMany({
        data: payload.quotes.map((quote, index) => ({
          eventId: event.id,
          subtitle: quote.subtitle,
          text: quote.text,
          source: quote.source,
          details: quote.details,
          sortOrder: index,
        })),
      });
    }

    if (payload.media.length) {
      await db.eventMedia.createMany({
        data: payload.media.map((media, index) => ({
          eventId: event.id,
          type: media.type,
          src: media.src,
          alt: media.alt,
          poster: media.poster,
          sortOrder: index,
        })),
      });
    }

    if (payload.followups) {
      await db.eventFollowupQuestion.createMany({
        data: [
          {
            eventId: event.id,
            questionType: 'action',
            prompt: payload.followups.action.prompt,
            inputType: payload.followups.action.type,
            choices: payload.followups.action.choices,
            correctIndex: payload.followups.action.correctIndex,
            explanation: payload.followups.action.explanation,
            sortOrder: 0,
          },
          {
            eventId: event.id,
            questionType: 'reaction',
            prompt: payload.followups.reaction.prompt,
            inputType: payload.followups.reaction.type,
            choices: payload.followups.reaction.choices,
            correctIndex: payload.followups.reaction.correctIndex,
            explanation: payload.followups.reaction.explanation,
            sortOrder: 1,
          },
        ],
      });
    }

    return successResponse(event, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Admin authentication required'));
    }
    if (error instanceof ZodError) {
      return errorResponse(
        new ApiError(
          400,
          'VALIDATION_ERROR',
          error.issues.map(issue => issue.message).join('; ')
        )
      );
    }
    return errorResponse(error);
  }
}
