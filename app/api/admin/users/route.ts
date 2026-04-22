import { db } from '@/lib/db/client';
import { requireAdmin } from '@/lib/auth/admin';
import { hashPassword } from '@/lib/auth/password';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { adminCreateUserSchema } from '@/lib/validation/user';

export async function GET() {
  try {
    await requireAdmin();
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        deletedAt: true,
      },
    });
    return successResponse(users);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Admin authentication required'));
    }
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = adminCreateUserSchema.parse(await request.json());

    const existing = await db.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ApiError(409, 'EMAIL_EXISTS', 'Email already registered');
    }

    const user = await db.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        passwordHash: hashPassword(payload.password),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(user, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Admin authentication required'));
    }
    return errorResponse(error);
  }
}
