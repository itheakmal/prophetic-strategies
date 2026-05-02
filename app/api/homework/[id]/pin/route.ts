import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireUserSession } from '@/lib/auth/user';
import { setPin } from '@/lib/services/homework-service';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_: Request, { params }: Params) {
  try {
    const session = await requireUserSession();
    const { id } = await params;

    const result = await setPin(session.sub, id, true);
    return successResponse(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_USER') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Login required'));
    }
    return errorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const session = await requireUserSession();
    const { id } = await params;

    const result = await setPin(session.sub, id, false);
    return successResponse(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_USER') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Login required'));
    }
    return errorResponse(error);
  }
}
