/**
 * Normalize `returnTo` from URLs / query params so post-login redirects stay on this app only.
 */
export function sanitizeReturnToPath(raw: string | null | undefined): string {
  const fallback = '/';

  if (raw === null || raw === undefined) return fallback;

  let decoded: string;
  try {
    decoded = decodeURIComponent(String(raw)).trim();
  } catch {
    return fallback;
  }

  const path = decoded.split('#')[0] ?? '';
  if (
    path.length === 0 ||
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.includes('://')
  )
    return fallback;

  return path;
}
