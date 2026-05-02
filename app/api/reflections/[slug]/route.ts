import { ZodError } from 'zod';
import { getUserSession } from '@/lib/auth/user';
import { db } from '@/lib/db/client';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { saveReflectionSchema } from '@/lib/validation/reflection';

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const session = await getUserSession();

    if (!session) {
      return successResponse({ authenticated: false, reflection: null });
    }

    const event = await db.event.findUnique({
      where: { slug },
      select: { id: true, deletedAt: true },
    });

    if (!event || event.deletedAt) {
      throw new ApiError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    const reflection = await db.personalReflection.findUnique({
      where: {
        userId_eventId: {
          userId: session.sub,
          eventId: event.id,
        },
      },
      select: { content: true, updatedAt: true },
    });

    return successResponse({
      authenticated: true,
      reflection: reflection
        ? { content: reflection.content, updatedAt: reflection.updatedAt.toISOString() }
        : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getUserSession();
    if (!session) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Login required to save reflection');
    }

    const { slug } = await params;
    const event = await db.event.findUnique({
      where: { slug },
      select: { id: true, deletedAt: true },
    });

    if (!event || event.deletedAt) {
      throw new ApiError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    const payload = saveReflectionSchema.parse(await request.json());
    const reflection = await db.personalReflection.upsert({
      where: {
        userId_eventId: {
          userId: session.sub,
          eventId: event.id,
        },
      },
      create: {
        userId: session.sub,
        eventId: event.id,
        content: payload.content,
      },
      update: {
        content: payload.content,
      },
      select: { content: true, updatedAt: true },
    });

    return successResponse(
      { content: reflection.content, updatedAt: reflection.updatedAt.toISOString() },
      201
    );
  } catch (error) {
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
