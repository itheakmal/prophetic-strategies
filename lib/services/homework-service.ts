import { db } from '@/lib/db/client';
import {
  HOMEWORK_ALLOWED_MIMES,
  HOMEWORK_MAX_FILE_BYTES,
  HOMEWORK_MAX_FILES,
  HOMEWORK_MAX_TOTAL_BYTES,
  homeworkCreateFieldsSchema,
  homeworkCommentBodySchema,
} from '@/lib/validation/homework';
import { ApiError } from '@/lib/errors';
import {
  homeworkFileAbsolutePath,
  makeStoredFileName,
  removeSubmissionDir,
  writeHomeworkBuffer,
} from '@/lib/uploads/homework-storage';
import fs from 'node:fs/promises';

type FilePart = {
  buffer: Uint8Array;
  originalName: string;
  mimeType: string;
};

export async function createHomeworkWithFiles(params: {
  userId: string;
  fields: { title: string; session: string; thoughts: string };
  files: FilePart[];
}) {
  const fields = homeworkCreateFieldsSchema.parse(params.fields);

  if (params.files.length === 0) {
    throw new ApiError(400, 'FILES_REQUIRED', 'Upload at least one file');
  }
  if (params.files.length > HOMEWORK_MAX_FILES) {
    throw new ApiError(400, 'TOO_MANY_FILES', `Maximum ${HOMEWORK_MAX_FILES} files`);
  }

  let total = 0;
  for (const f of params.files) {
    const sizeBytes = f.buffer.byteLength;
    if (!HOMEWORK_ALLOWED_MIMES.has(f.mimeType)) {
      throw new ApiError(
        400,
        'INVALID_FILE_TYPE',
        'Only images (JPEG, PNG, GIF, WebP), PDF, and plain text are allowed'
      );
    }
    if (sizeBytes > HOMEWORK_MAX_FILE_BYTES) {
      throw new ApiError(
        400,
        'FILE_TOO_LARGE',
        `Each file must be at most ${HOMEWORK_MAX_FILE_BYTES / (1024 * 1024)} MB`
      );
    }
    total += sizeBytes;
    if (total > HOMEWORK_MAX_TOTAL_BYTES) {
      throw new ApiError(
        400,
        'TOTAL_UPLOAD_TOO_LARGE',
        'Total upload size exceeds the limit'
      );
    }
  }

  let submissionId: string | null = null;

  try {
    const submission = await db.homeworkSubmission.create({
      data: {
        userId: params.userId,
        title: fields.title,
        sessionLabel: fields.session,
        thoughts: fields.thoughts,
      },
    });
    submissionId = submission.id;

    const rowsWithBuffers: {
      originalName: string;
      storedFileName: string;
      mimeType: string;
      sizeBytes: number;
      buffer: Uint8Array;
    }[] = [];

    for (const f of params.files) {
      const storedFileName = makeStoredFileName(f.originalName || 'upload', f.mimeType);
      rowsWithBuffers.push({
        originalName: (f.originalName || 'upload').slice(0, 480),
        storedFileName,
        mimeType: f.mimeType,
        sizeBytes: f.buffer.byteLength,
        buffer: f.buffer,
      });
    }

    await db.homeworkFile.createMany({
      data: rowsWithBuffers.map(r => ({
        submissionId: submission.id,
        originalName: r.originalName,
        storedFileName: r.storedFileName,
        mimeType: r.mimeType,
        sizeBytes: r.sizeBytes,
      })),
    });

    for (const row of rowsWithBuffers) {
      await writeHomeworkBuffer(submission.id, row.storedFileName, row.buffer);
    }

    return submission;
  } catch (error) {
    if (submissionId) {
      await removeSubmissionDir(submissionId).catch(() => {});
      await db.homeworkSubmission.deleteMany({ where: { id: submissionId } }).catch(() => {});
    }
    throw error;
  }
}

export async function listHomeworkFeed(params: {
  userId?: string | null;
  pinnedOnly?: boolean;
  mineOnly?: boolean;
  cursor?: string | null;
  take?: number;
}) {
  const take = Math.min(params.take ?? 20, 50);
  const mineOnly = Boolean(params.mineOnly && params.userId);
  const pinnedOnly = Boolean(params.pinnedOnly && params.userId && !mineOnly);

  const items = await db.homeworkSubmission.findMany({
    where: mineOnly
      ? { deletedAt: null, userId: params.userId! }
      : pinnedOnly
        ? {
            deletedAt: null,
            pins: { some: { userId: params.userId! } },
          }
        : { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: take + 1,
    ...(params.cursor ? { cursor: { id: params.cursor }, skip: 1 } : {}),
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      files: { select: { id: true } },
      _count: {
        select: { comments: true, pins: true },
      },
    },
  });

  const hasMore = items.length > take;
  const slice = hasMore ? items.slice(0, take) : items;

  const ids = slice.map(i => i.id);
  let pinnedSet = new Set<string>();
  if (params.userId && ids.length > 0) {
    const pins = await db.homeworkPin.findMany({
      where: { userId: params.userId, homeworkId: { in: ids } },
      select: { homeworkId: true },
    });
    pinnedSet = new Set(pins.map(p => p.homeworkId));
  }

  const nextCursor = hasMore ? slice[slice.length - 1]?.id ?? null : null;

  return {
    items: slice.map(row => ({
      id: row.id,
      title: row.title,
      sessionLabel: row.sessionLabel,
      thoughtsPreview:
        row.thoughts.length > 200 ? `${row.thoughts.slice(0, 200)}…` : row.thoughts,
      createdAt: row.createdAt.toISOString(),
      author: {
        id: row.user.id,
        name: row.user.name,
        email: row.user.email,
      },
      fileCount: row.files.length,
      commentCount: row._count.comments,
      pinCount: row._count.pins,
      pinnedByMe: params.userId ? pinnedSet.has(row.id) : false,
    })),
    nextCursor,
  };
}

export async function getHomeworkDetail(id: string, viewerId?: string | null) {
  const row = await db.homeworkSubmission.findFirst({
    where: { id, deletedAt: null },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      files: {
        select: { id: true, originalName: true, mimeType: true, sizeBytes: true },
      },
      _count: { select: { comments: true, pins: true } },
    },
  });

  if (!row) return null;

  let pinnedByMe = false;
  if (viewerId) {
    const pin = await db.homeworkPin.findUnique({
      where: { userId_homeworkId: { userId: viewerId, homeworkId: row.id } },
    });
    pinnedByMe = pin !== null;
  }

  return {
    id: row.id,
    title: row.title,
    sessionLabel: row.sessionLabel,
    thoughts: row.thoughts,
    createdAt: row.createdAt.toISOString(),
    author: {
      id: row.user.id,
      name: row.user.name,
      email: row.user.email,
    },
    files: row.files.map(f => ({
      id: f.id,
      originalName: f.originalName,
      mimeType: f.mimeType,
      sizeBytes: f.sizeBytes,
    })),
    commentCount: row._count.comments,
    pinCount: row._count.pins,
    pinnedByMe,
  };
}

export async function addHomeworkComment(params: {
  homeworkId: string;
  userId: string;
  body: unknown;
}) {
  const { body } = homeworkCommentBodySchema.parse({ body: params.body });

  const hw = await db.homeworkSubmission.findFirst({
    where: { id: params.homeworkId, deletedAt: null },
    select: { id: true },
  });
  if (!hw) {
    throw new ApiError(404, 'HOMEWORK_NOT_FOUND', 'Homework not found');
  }

  return db.homeworkComment.create({
    data: {
      homeworkId: params.homeworkId,
      userId: params.userId,
      body,
    },
    select: {
      id: true,
      body: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function listComments(homeworkId: string, skip: number, take: number) {
  const hw = await db.homeworkSubmission.findFirst({
    where: { id: homeworkId, deletedAt: null },
    select: { id: true },
  });
  if (!hw) throw new ApiError(404, 'HOMEWORK_NOT_FOUND', 'Homework not found');

  const comments = await db.homeworkComment.findMany({
    where: { homeworkId },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    select: {
      id: true,
      body: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const total = await db.homeworkComment.count({ where: { homeworkId } });
  return { comments, total };
}

export async function setPin(userId: string, homeworkId: string, pin: boolean) {
  const hw = await db.homeworkSubmission.findFirst({
    where: { id: homeworkId, deletedAt: null },
    select: { id: true },
  });
  if (!hw) throw new ApiError(404, 'HOMEWORK_NOT_FOUND', 'Homework not found');

  if (pin) {
    await db.homeworkPin.upsert({
      where: {
        userId_homeworkId: { userId, homeworkId },
      },
      create: { userId, homeworkId },
      update: {},
    });
  } else {
    await db.homeworkPin.deleteMany({ where: { userId, homeworkId } });
  }

  const count = await db.homeworkPin.count({ where: { userId, homeworkId } });

  return { pinned: count > 0 };
}

export async function getFileForDownload(params: {
  submissionId: string;
  fileId: string;
  requesterUserId: string | null | undefined;
}) {
  const fileRow = await db.homeworkFile.findFirst({
    where: { id: params.fileId, submissionId: params.submissionId },
    include: {
      submission: {
        select: {
          deletedAt: true,
        },
      },
    },
  });

  if (!fileRow || fileRow.submission.deletedAt !== null || !params.requesterUserId) {
    return null;
  }

  const abs = homeworkFileAbsolutePath(params.submissionId, fileRow.storedFileName);
  const buf = await fs.readFile(abs).catch(() => null);
  if (!buf) return null;

  return {
    buffer: buf,
    mimeType: fileRow.mimeType,
    originalName: fileRow.originalName,
  };
}
