import { db } from '@/lib/db/client';
import { errorResponse, successResponse } from '@/lib/errors';
import { createResetToken, hashResetToken } from '@/lib/auth/password';
import { forgotPasswordSchema } from '@/lib/validation/user';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { email } = forgotPasswordSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email } });

    if (!user || user.deletedAt) {
      return successResponse({ message: 'If the email exists, a reset link has been generated.' });
    }

    const token = createResetToken();
    const tokenHash = hashResetToken(token);

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    // In production this should be emailed. For now it is logged for local flow.
    logger.info({ email, token }, 'Password reset token created');

    return successResponse({
      message: 'If the email exists, a reset link has been generated.',
      resetPath: `/reset-password?token=${token}`,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
