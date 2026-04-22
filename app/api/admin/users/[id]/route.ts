import { db } from '@/lib/db/client';
import { requireAdmin } from '@/lib/auth/admin';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as { role?: 'ADMIN' | 'EDITOR'; deleted?: boolean };

    const user = await db.user.update({
      where: { id },
      data: {
        role: body.role,
        deletedAt: body.deleted ? new Date() : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        deletedAt: true,
      },
    });

    return successResponse(user);
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

    await db.user.update({
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
