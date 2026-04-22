import { db } from '@/lib/db/client';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireAdmin } from '@/lib/auth/admin';
import { updateTribeSchema } from '@/lib/validation/tribe';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const tribe = await db.tribe.findUnique({ where: { id } });

    if (!tribe) {
      throw new ApiError(404, 'TRIBE_NOT_FOUND', 'Tribe not found');
    }

    return successResponse(tribe);
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
    const payload = updateTribeSchema.parse(await request.json());

    const tribe = await db.tribe.update({
      where: { id },
      data: {
        externalId: payload.externalId,
        name: payload.name,
        group: payload.group,
        phase: payload.phase,
        x: payload.x,
        y: payload.y,
        lat: payload.lat,
        lon: payload.lon,
        elders: payload.elders,
        chiefs: payload.chiefs,
        refs: payload.refs,
      },
    });

    return successResponse(tribe);
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

    await db.tribe.update({
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
