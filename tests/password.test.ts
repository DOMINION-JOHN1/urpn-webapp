import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, hashPasswordSync } from '@/lib/server/password';

describe('password hashing', () => {
  it('verifies a correct password and rejects a wrong one', async () => {
    const hash = await hashPassword('urpn2026');
    expect(hash).toContain(':');
    expect(await verifyPassword('urpn2026', hash)).toBe(true);
    expect(await verifyPassword('wrong-password', hash)).toBe(false);
  });

  it('supports the synchronous seed hash', async () => {
    const hash = hashPasswordSync('seed-password');
    expect(await verifyPassword('seed-password', hash)).toBe(true);
  });

  it('rejects malformed hashes without throwing', async () => {
    expect(await verifyPassword('anything', 'not-a-hash')).toBe(false);
    expect(await verifyPassword('anything', '')).toBe(false);
  });
});
