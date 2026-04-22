type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  store.set(key, entry);
  return { allowed: true, remaining: maxRequests - entry.count };
}
