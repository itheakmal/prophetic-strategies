import { db } from '@/lib/db/client';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { verifyPassword } from '@/lib/auth/password';
import { createUserSession } from '@/lib/auth/user';
import { loginSchema } from '@/lib/validation/user';

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());

    const user = await db.user.findUnique({ where: { email: payload.email } });
    if (!user || !user.passwordHash || !verifyPassword(payload.password, user.passwordHash)) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    await createUserSession({ sub: user.id, email: user.email, role: user.role });

    return successResponse({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    return errorResponse(error);
  }
}
