import { db } from '@/lib/db/client';
import { hashPassword, hashResetToken } from '@/lib/auth/password';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { resetPasswordSchema } from '@/lib/validation/user';

export async function POST(request: Request) {
  try {
    const { token, password } = resetPasswordSchema.parse(await request.json());
    const tokenHash = hashResetToken(token);

    const reset = await db.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
      throw new ApiError(400, 'TOKEN_INVALID', 'Reset token is invalid or expired');
    }

    await db.$transaction([
      db.user.update({
        where: { id: reset.userId },
        data: { passwordHash: hashPassword(password) },
      }),
      db.passwordResetToken.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return successResponse({ message: 'Password has been reset. Please log in.' });
  } catch (error) {
    return errorResponse(error);
  }
}
