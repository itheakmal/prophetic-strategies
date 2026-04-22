import { getAdminSession } from '@/lib/auth/admin';
import { successResponse, errorResponse } from '@/lib/errors';

export async function GET() {
  try {
    const session = await getAdminSession();
    return successResponse({ authenticated: Boolean(session), session });
  } catch (error) {
    return errorResponse(error);
  }
}
