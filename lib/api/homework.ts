import { ApiClientError } from '@/lib/api/public';

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new ApiClientError(
      payload?.error?.message ?? 'Request failed',
      response.status,
      payload?.error?.code
    );
  }

  return payload.data as T;
}

export type HomeworkFeedItem = {
  id: string;
  title: string;
  sessionLabel: string;
  thoughtsPreview: string;
  createdAt: string;
  author: { id: string; name: string | null; email: string };
  fileCount: number;
  commentCount: number;
  pinCount: number;
  pinnedByMe: boolean;
};

export type HomeworkFeedResponse = {
  items: HomeworkFeedItem[];
  nextCursor: string | null;
};

export type HomeworkDetail = {
  id: string;
  title: string;
  sessionLabel: string;
  thoughts: string;
  createdAt: string;
  author: { id: string; name: string | null; email: string };
  files: Array<{ id: string; originalName: string; mimeType: string; sizeBytes: number }>;
  commentCount: number;
  pinCount: number;
  pinnedByMe: boolean;
};

export type HomeworkCommentRow = {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
};

export type HomeworkCommentsResponse = {
  comments: HomeworkCommentRow[];
  page: number;
  take: number;
  total: number;
};

export async function fetchHomeworkFeed(opts: {
  pinnedOnly?: boolean;
  mineOnly?: boolean;
  cursor?: string | null;
  take?: number;
}): Promise<HomeworkFeedResponse> {
  const sp = new URLSearchParams();
  if (opts.pinnedOnly) sp.set('pinned', '1');
  if (opts.mineOnly) sp.set('mine', '1');
  if (opts.cursor) sp.set('cursor', opts.cursor);
  if (opts.take) sp.set('take', String(opts.take));
  const q = sp.toString();
  const url = `/api/homework${q ? `?${q}` : ''}`;
  const response = await fetch(url, { cache: 'no-store' });
  return parseResponse<HomeworkFeedResponse>(response);
}

export async function fetchHomeworkDetail(id: string): Promise<HomeworkDetail> {
  const response = await fetch(`/api/homework/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  });
  return parseResponse<HomeworkDetail>(response);
}

export async function fetchHomeworkComments(
  id: string,
  page = 1,
  take = 50
): Promise<HomeworkCommentsResponse> {
  const response = await fetch(
    `/api/homework/${encodeURIComponent(id)}/comments?page=${page}&take=${take}`,
    { cache: 'no-store' }
  );
  return parseResponse<HomeworkCommentsResponse>(response);
}

export async function postHomeworkComment(id: string, body: string) {
  const response = await fetch(`/api/homework/${encodeURIComponent(id)}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  return parseResponse<HomeworkCommentRow>(response);
}

export async function setHomeworkPinned(id: string, pinned: boolean) {
  const response = await fetch(`/api/homework/${encodeURIComponent(id)}/pin`, {
    method: pinned ? 'POST' : 'DELETE',
  });
  return parseResponse<{ pinned: boolean }>(response);
}

export function homeworkFileDownloadUrl(submissionId: string, fileId: string) {
  return `/api/homework/${encodeURIComponent(submissionId)}/files/${encodeURIComponent(fileId)}`;
}
