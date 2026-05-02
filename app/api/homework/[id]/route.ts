import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireUserSession } from '@/lib/auth/user';
import { getHomeworkDetail } from '@/lib/services/homework-service';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const session = await requireUserSession();
    const { id } = await params;
    const detail = await getHomeworkDetail(id, session.sub);

    if (!detail) {
      throw new ApiError(404, 'HOMEWORK_NOT_FOUND', 'Homework not found');
    }

    return successResponse(detail);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_USER') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Login required'));
    }
    return errorResponse(error);
  }
}
