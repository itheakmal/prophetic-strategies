import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireUserSession } from '@/lib/auth/user';
import { getDashboardStatsForUser } from '@/lib/services/dashboard-stats-service';

export async function GET() {
  try {
    const session = await requireUserSession();
    const data = await getDashboardStatsForUser(session.sub);
    return successResponse(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_USER') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Login required'));
    }
    return errorResponse(error);
  }
}
