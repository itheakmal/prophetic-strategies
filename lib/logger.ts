import pino from 'pino';

/**
 * Plain JSON logs only. Do NOT use `pino-pretty` transport here—it spawns worker
 * threads (`thread-stream`) that break under Next.js bundling/Turbopack with errors like:
 * Cannot find module '.../.next/server/vendor-chunks/lib/worker.js'.
 * For readable local logs: pipe dev output through `pino-pretty` if desired.
 */
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});
