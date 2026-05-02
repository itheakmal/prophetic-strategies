import path from 'node:path';
import fs from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { env } from '@/lib/env';

const SUBDIR = 'homework';

function uploadRootResolved() {
  const root =
    env.HOMEWORK_UPLOAD_ROOT?.trim() || path.join(process.cwd(), 'uploads');
  return path.isAbsolute(root) ? root : path.join(process.cwd(), root);
}

export function homeworkSubmissionDir(submissionId: string) {
  return path.join(uploadRootResolved(), SUBDIR, submissionId);
}

export function homeworkFileAbsolutePath(submissionId: string, storedFileName: string) {
  return path.join(homeworkSubmissionDir(submissionId), storedFileName);
}

export async function ensureSubmissionDir(submissionId: string) {
  const dir = homeworkSubmissionDir(submissionId);
  await fs.mkdir(dir, { recursive: true });
}

export function makeStoredFileName(originalName: string, mimeType: string) {
  const base = path.basename(originalName.replace(/\\/g, '/')).replace(/[^\w.-]+/g, '_');
  const extFromName = path.extname(base);
  let ext =
    extFromName ||
    (mimeType === 'application/pdf'
      ? '.pdf'
      : mimeType.startsWith('image/')
        ? '.bin'
        : mimeType === 'text/plain'
          ? '.txt'
          : '.bin');

  const token = randomBytes(16).toString('hex');
  return `${token}${ext}`;
}

export async function writeHomeworkBuffer(
  submissionId: string,
  storedFileName: string,
  buffer: Uint8Array
) {
  await ensureSubmissionDir(submissionId);
  const fp = homeworkFileAbsolutePath(submissionId, storedFileName);
  await fs.writeFile(fp, buffer);
}

export async function removeSubmissionDir(submissionId: string) {
  const dir = homeworkSubmissionDir(submissionId);
  await fs.rm(dir, { recursive: true, force: true });
}
