export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body?.success) {
    const msg = body?.error?.message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return body.data as T;
}
