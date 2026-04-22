import { db } from '@/lib/db/client';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireAdmin } from '@/lib/auth/admin';

export async function GET() {
  try {
    await requireAdmin();
    const contacts = await db.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(contacts);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Admin authentication required'));
    }
    return errorResponse(error);
  }
}
