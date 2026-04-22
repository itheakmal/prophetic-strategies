import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit } from '../lib/rate-limit.ts';

test('rate limit blocks after max requests', () => {
  const key = `test:${Date.now()}`;

  const first = checkRateLimit(key, 2, 5000);
  const second = checkRateLimit(key, 2, 5000);
  const third = checkRateLimit(key, 2, 5000);

  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(third.allowed, false);
});
