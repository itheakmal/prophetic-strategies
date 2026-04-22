import { db } from '@/lib/db/client';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireAdmin } from '@/lib/auth/admin';
import { updateEventSchema } from '@/lib/validation/event';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const event = await db.event.findUnique({ where: { id } });

    if (!event) {
      throw new ApiError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    return successResponse(event);
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
    const payload = updateEventSchema.parse(await request.json());

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

    return successResponse(event);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Admin authentication required'));
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
