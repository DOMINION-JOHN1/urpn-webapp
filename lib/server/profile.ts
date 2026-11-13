import type { StoredUser } from './types';

export function hasCompleteProfile(
  user: Pick<StoredUser, 'name' | 'birthday' | 'address' | 'avatarPath' | 'avatarMimeType'>
): boolean {
  return Boolean(
    user.name.trim() &&
      user.birthday &&
      user.address?.trim() &&
      user.avatarPath &&
      user.avatarMimeType
  );
}
