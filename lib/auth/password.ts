import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;

  const candidate = scryptSync(password, salt, KEY_LENGTH);
  const target = Buffer.from(hash, 'hex');

  if (candidate.length !== target.length) return false;
  return timingSafeEqual(candidate, target);
}

export function createResetToken() {
  return randomBytes(32).toString('hex');
}

export function hashResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
