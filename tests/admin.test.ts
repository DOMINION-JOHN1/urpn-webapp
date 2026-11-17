import { describe, it, expect } from 'vitest';
import { readDb, ensureAdminUser } from '@/lib/server/db';
import { verifyPassword } from '@/lib/server/password';
import { getAdminWorkforceData } from '@/lib/server/learning';

describe('Admin Authentication & Workforce Dashboard', () => {
  it('has the admin account seeded with username and password revival@2015', async () => {
    const db = await readDb();
    const adminUser = db.users.find(
      (u) =>
        u.id === 'usr_admin' ||
        u.email === 'uniquerevivalprayernetwork@urpn.org' ||
        u.email === 'uniquerevivalprayernetwork'
    );

    expect(adminUser).toBeDefined();
    expect(adminUser?.role).toBe('admin');

    // Verify password revival@2015
    const isPasswordCorrect = await verifyPassword('revival@2015', adminUser!.passwordHash);
    expect(isPasswordCorrect).toBe(true);

    // Verify wrong password is rejected
    const isWrongRejected = await verifyPassword('wrongpassword', adminUser!.passwordHash);
    expect(isWrongRejected).toBe(false);
  });

  it('retrieves everyone who has applied for workforce', async () => {
    const data = await getAdminWorkforceData();
    expect(data.applicants).toBeDefined();
    expect(data.summary).toBeDefined();
    expect(data.summary.totalApplicants).toBeGreaterThanOrEqual(1);

    // Verify applicant details structure
    const applicant = data.applicants[0];
    expect(applicant.user).toBeDefined();
    expect(applicant.user.email).toBeDefined();
    expect(applicant.overallStatus).toBeDefined();
    expect(Array.isArray(applicant.departments)).toBe(true);
  });
});
