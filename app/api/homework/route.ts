import { ZodError } from 'zod';
import {
  HOMEWORK_ALLOWED_MIMES,
  homeworkCreateFieldsSchema,
} from '@/lib/validation/homework';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { requireUserSession } from '@/lib/auth/user';
import { createHomeworkWithFiles, listHomeworkFeed } from '@/lib/services/homework-service';

function unauthorizedHandler() {
  return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Login required'));
}

async function mimeFromBlob(file: File, originalName: string) {
  if (file.type && HOMEWORK_ALLOWED_MIMES.has(file.type)) {
    return file.type;
  }
  const lower = originalName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.txt')) return 'text/plain';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.webp')) return 'image/webp';
  return file.type || 'application/octet-stream';
}

export async function GET(request: Request) {
  try {
    const session = await requireUserSession();
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const pinnedOnly = url.searchParams.get('pinned') === '1' || url.searchParams.get('pinned') === 'true';
    const mineOnly = url.searchParams.get('mine') === '1' || url.searchParams.get('mine') === 'true';
    const take = Number(url.searchParams.get('take') ?? '20') || 20;

    const data = await listHomeworkFeed({
      userId: session.sub,
      pinnedOnly,
      mineOnly,
      cursor,
      take,
    });
    return successResponse(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_USER') {
      return unauthorizedHandler();
    }
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireUserSession();

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      throw new ApiError(400, 'INVALID_BODY', 'Expected multipart form data');
    }

    const rawTitle = formData.get('title');
    const rawSession = formData.get('session');
    const rawThoughts = formData.get('thoughts');

    const fields = homeworkCreateFieldsSchema.parse({
      title: typeof rawTitle === 'string' ? rawTitle : '',
      session: typeof rawSession === 'string' ? rawSession : '',
      thoughts: typeof rawThoughts === 'string' ? rawThoughts : '',
    });

    const fileEntries = formData.getAll('files');
    const files = await Promise.all(
      fileEntries
        .filter((e): e is File => typeof e !== 'string' && e instanceof File && e.size > 0)
        .map(async file => ({
          buffer: new Uint8Array(await file.arrayBuffer()),
          originalName: file.name || 'upload',
          mimeType: await mimeFromBlob(file, file.name),
        }))
    );

    const submission = await createHomeworkWithFiles({
      userId: session.sub,
      fields,
      files,
    });

    return successResponse({ id: submission.id }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_USER') {
      return unauthorizedHandler();
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
