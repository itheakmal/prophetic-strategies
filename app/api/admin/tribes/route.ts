import { db } from '@/lib/db/client';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireAdmin } from '@/lib/auth/admin';
import { createTribeSchema } from '@/lib/validation/tribe';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get('phase') ?? 'meccan';

    const tribes = await db.tribe.findMany({
      where: { phase, deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return successResponse(tribes);
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
    const payload = createTribeSchema.parse(await request.json());

    const tribe = await db.tribe.create({
      data: {
        externalId: payload.externalId,
        name: payload.name,
        group: payload.group,
        phase: payload.phase,
        x: payload.x,
        y: payload.y,
        lat: payload.lat,
        lon: payload.lon,
        elders: payload.elders ?? [],
        chiefs: payload.chiefs ?? [],
        refs: payload.refs ?? [],
      },
    });

    return successResponse(tribe, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Admin authentication required'));
    }
    return errorResponse(error);
  }
}
