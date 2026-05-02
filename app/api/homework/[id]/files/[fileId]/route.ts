import { NextResponse } from 'next/server';
import { ApiError, errorResponse } from '@/lib/errors';
import { requireUserSession } from '@/lib/auth/user';
import { getFileForDownload } from '@/lib/services/homework-service';

interface Params {
  params: Promise<{ id: string; fileId: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const session = await requireUserSession();
    const { id: submissionId, fileId } = await params;

    const payload = await getFileForDownload({
      submissionId,
      fileId,
      requesterUserId: session.sub,
    });

    if (!payload) {
      throw new ApiError(404, 'FILE_NOT_FOUND', 'File not found');
    }

    const safeName =
      /^[\w\s.-]+$/.test(payload.originalName) && payload.originalName.length <= 200
        ? payload.originalName
        : `download.${payload.mimeType.split('/')[1] ?? 'bin'}`;

    return new NextResponse(payload.buffer, {
      status: 200,
      headers: {
        'Content-Type': payload.mimeType,
        'Content-Length': String(payload.buffer.byteLength),
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(safeName)}`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED_USER') {
      return errorResponse(new ApiError(401, 'UNAUTHORIZED', 'Login required'));
    }
    return errorResponse(error);
  }
}
