import { ZodError } from 'zod';
import { env } from '@/lib/env';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireUserSession } from '@/lib/auth/user';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  addHomeworkComment,
  listComments,
} from '@/lib/services/homework-service';

interface Params {
  params: Promise<{ id: string }>;
}

function clientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() ?? 'unknown';
}

export async function GET(request: Request, { params }: Params) {
  try {
    await requireUserSession();
    const { id } = await params;
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const take = Math.min(50, Math.max(1, Number(url.searchParams.get('take') ?? '20')));
    const skip = (page - 1) * take;

    const { comments, total } = await listComments(id, skip, take);
    return successResponse({
      comments: comments.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
      page,
      take,
      total,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_USER') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Login required'));
    }
    return errorResponse(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await requireUserSession();
    const { id } = await params;

    const rateKey = `hw-comment:${session.sub}:${clientIp(request)}`;
    const rate = checkRateLimit(rateKey, 40, env.RATE_LIMIT_WINDOW_MS);
    if (!rate.allowed) {
      throw new ApiError(429, 'RATE_LIMITED', 'Too many comments');
    }

    const bodyUnknown = await request.json().catch(() => null);

    const created = await addHomeworkComment({
      homeworkId: id,
      userId: session.sub,
      body: bodyUnknown?.body,
    });

    return successResponse(
      {
        ...created,
        createdAt: created.createdAt.toISOString(),
      },
      201
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_USER') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Login required'));
    }
    if (error instanceof ZodError) {
      return errorResponse(
        new ApiError(
          400,
          'VALIDATION_ERROR',
          error.issues.map(i => i.message).join('; ')
        )
      );
    }
    return errorResponse(error);
  }
}
