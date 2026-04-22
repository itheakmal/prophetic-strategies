import { db } from '@/lib/db/client';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { hashPassword } from '@/lib/auth/password';
import { createUserSession } from '@/lib/auth/user';
import { signupSchema } from '@/lib/validation/user';

export async function POST(request: Request) {
  try {
    const payload = signupSchema.parse(await request.json());

    const existing = await db.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ApiError(409, 'EMAIL_EXISTS', 'Email already registered');
    }

    const user = await db.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        role: 'EDITOR',
        passwordHash: hashPassword(payload.password),
      },
    });

    await createUserSession({ sub: user.id, email: user.email, role: user.role });

    return successResponse({ id: user.id, email: user.email, role: user.role }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
