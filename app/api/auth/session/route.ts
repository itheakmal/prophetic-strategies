import { getUserSession } from '@/lib/auth/user';
import { errorResponse, successResponse } from '@/lib/errors';

export async function GET() {
  try {
    const session = await getUserSession();
    return successResponse({ authenticated: Boolean(session), session });
  } catch (error) {
    return errorResponse(error);
  }
}
