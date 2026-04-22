import { env } from '@/lib/env';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { createAdminSession } from '@/lib/auth/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? '');
    const password = String(body?.password ?? '');

    if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    await createAdminSession(email);
    return successResponse({ email, role: 'ADMIN' });
  } catch (error) {
    return errorResponse(error);
  }
}
