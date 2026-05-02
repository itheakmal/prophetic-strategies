import { db } from '@/lib/db/client';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireAdmin } from '@/lib/auth/admin';
import { updateEventSchema } from '@/lib/validation/event';
import { ZodError } from 'zod';

interface Params {
  params: Promise<{ id: string }>;
}

function defaultFollowup() {
  return {
    prompt: '',
    type: 'mcq',
    choices: ['', ''],
    correctIndex: 0,
    explanation: '',
  } as const;
}

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

  if (payload.followups && typeof payload.followups === 'object') {
    const normalizeFollowup = (f: Record<string, any>) => ({
      ...f,
      choices: Array.isArray(f?.choices)
        ? f.choices.map((c: string) => String(c).trim()).filter(Boolean)
        : f?.choices,
    });
    payload.followups = {
      action: normalizeFollowup(payload.followups.action ?? {}),
      reaction: normalizeFollowup(payload.followups.reaction ?? {}),
    };
  }

  return payload;
}

export async function GET(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const event = await db.event.findUnique({
      where: { id },
      include: {
        quotes: { orderBy: { sortOrder: 'asc' } },
        mediaItems: { orderBy: { sortOrder: 'asc' } },
        followupQuestions: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!event) {
      throw new ApiError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    const action = event.followupQuestions.find(f => f.questionType === 'action');
    const reaction = event.followupQuestions.find(f => f.questionType === 'reaction');

    return successResponse({
      id: event.id,
      slug: event.slug,
      title: event.title,
      location: event.location,
      era: event.era,
      context: event.context,
      summary: event.summary,
      chronologyOrder: event.chronologyOrder,
      deeper: event.deeperPoints,
      lessons: event.lessons,
      parallels: event.parallels,
      quotes: event.quotes.map(q => ({
        subtitle: q.subtitle,
        text: q.text,
        source: q.source,
        details: q.details ?? undefined,
      })),
      media: event.mediaItems.map(m => ({
        type: m.type,
        src: m.src,
        alt: m.alt ?? undefined,
        poster: m.poster ?? undefined,
      })),
      followups: {
        action: action
          ? {
              prompt: action.prompt,
              type: action.inputType,
              choices: action.choices,
              correctIndex: action.correctIndex,
              explanation: action.explanation,
            }
          : defaultFollowup(),
        reaction: reaction
          ? {
              prompt: reaction.prompt,
              type: reaction.inputType,
              choices: reaction.choices,
              correctIndex: reaction.correctIndex,
              explanation: reaction.explanation,
            }
          : defaultFollowup(),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Admin authentication required'));
    }
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const payload = updateEventSchema.parse(normalizeEventPayload(await request.json()));

    const event = await db.event.update({
      where: { id },
      data: {
        slug: payload.slug,
        title: payload.title,
        location: payload.location,
        era: payload.era,
        context: payload.context,
        summary: payload.summary,
        chronologyOrder: payload.chronologyOrder,
        deeperPoints: payload.deeper,
        lessons: payload.lessons,
        parallels: payload.parallels,
      },
    });

    if (payload.quotes) {
      await db.eventQuote.deleteMany({ where: { eventId: id } });
      if (payload.quotes.length) {
        await db.eventQuote.createMany({
          data: payload.quotes.map((quote, index) => ({
            eventId: id,
            subtitle: quote.subtitle,
            text: quote.text,
            source: quote.source,
            details: quote.details,
            sortOrder: index,
          })),
        });
      }
    }

    if (payload.media) {
      await db.eventMedia.deleteMany({ where: { eventId: id } });
      if (payload.media.length) {
        await db.eventMedia.createMany({
          data: payload.media.map((media, index) => ({
            eventId: id,
            type: media.type,
            src: media.src,
            alt: media.alt,
            poster: media.poster,
            sortOrder: index,
          })),
        });
      }
    }

    if (payload.followups !== undefined) {
      await db.eventFollowupQuestion.deleteMany({ where: { eventId: id } });
      if (payload.followups) {
        await db.eventFollowupQuestion.createMany({
          data: [
            {
              eventId: id,
              questionType: 'action',
              prompt: payload.followups.action.prompt,
              inputType: payload.followups.action.type,
              choices: payload.followups.action.choices,
              correctIndex: payload.followups.action.correctIndex,
              explanation: payload.followups.action.explanation,
              sortOrder: 0,
            },
            {
              eventId: id,
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
    }

    return successResponse(event);
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

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    await db.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Admin authentication required'));
    }
    return errorResponse(error);
  }
}
