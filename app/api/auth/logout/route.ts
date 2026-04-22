import { clearUserSession } from '@/lib/auth/user';
import { errorResponse, successResponse } from '@/lib/errors';

export async function POST() {
  try {
    await clearUserSession();
    return successResponse({ loggedOut: true });
  } catch (error) {
    return errorResponse(error);
  }
}
