import { ApiClientError } from '@/lib/api/public';

export type DashboardStats = {
  reflectionCount: number;
  homeworkCount: number;
  commentCount: number;
  pinnedCount: number;
  progressPct: number;
  achievements: Array<{ id: string; label: string; description: string }>;
};

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

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('/api/dashboard/stats', { cache: 'no-store' });
  return parseResponse<DashboardStats>(response);
}
