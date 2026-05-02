/**
 * Normalize DATABASE_URL for @prisma/adapter-mariadb (MariaDB connector).
 * Uses `mariadb://` URI format and merges common MySQL-compat query params when missing.
 */
export function mariadbAdapterUrlFromDatabaseUrl(raw: string): string {
  const withMariaDbScheme = raw.startsWith('mysql://')
    ? `mariadb://${raw.slice('mysql://'.length)}`
    : raw.startsWith('mariadb://')
      ? raw
      : `mariadb://${raw}`;

  try {
    const url = new URL(withMariaDbScheme);
    if (!url.searchParams.has('allowPublicKeyRetrieval')) {
      url.searchParams.set('allowPublicKeyRetrieval', 'true');
    }
    if (!url.searchParams.has('connectTimeout')) {
      url.searchParams.set('connectTimeout', '8000');
    }
    return url.toString();
  } catch {
    const join = withMariaDbScheme.includes('?') ? '&' : '?';
    return `${withMariaDbScheme}${join}allowPublicKeyRetrieval=true&connectTimeout=8000`;
  }
}
