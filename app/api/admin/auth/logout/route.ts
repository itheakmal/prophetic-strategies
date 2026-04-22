import { clearAdminSession } from '@/lib/auth/admin';
import { successResponse, errorResponse } from '@/lib/errors';

export async function POST() {
  try {
    await clearAdminSession();
    return successResponse({ loggedOut: true });
  } catch (error) {
    return errorResponse(error);
  }
}
