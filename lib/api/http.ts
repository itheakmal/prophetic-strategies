export async function httpGet<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload?.error?.message ?? 'Request failed');
  }

  return payload.data as T;
}
