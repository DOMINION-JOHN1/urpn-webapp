'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, Check, Loader2, Save, UserRound } from 'lucide-react';

function avatarUrl(avatarPath: string | null) {
  if (!avatarPath) return null;
  const filename = avatarPath.split('/').pop() ?? '';
  return `/api/portal/profile/avatar?v=${encodeURIComponent(filename)}`;
}

export function ProfileForm({
  email,
  initialName,
  initialBirthday,
  initialAddress,
  avatarPath,
  nextPath,
}: {
  email: string;
  initialName: string;
  initialBirthday: string;
  initialAddress: string;
  avatarPath: string | null;
  nextPath: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [birthday, setBirthday] = useState(initialBirthday);
  const [address, setAddress] = useState(initialAddress);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(avatarUrl(avatarPath));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(avatarUrl(avatarPath));
      return;
    }
    const preview = URL.createObjectURL(photo);
    setPhotoPreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [photo, avatarPath]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const profileResponse = await fetch('/api/portal/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthday, address }),
      });
      const profileData = await profileResponse.json().catch(() => ({}));
      if (!profileResponse.ok) throw new Error(profileData.error || 'Could not save your profile.');

      if (photo) {
        const form = new FormData();
        form.set('avatar', photo);
        const photoResponse = await fetch('/api/portal/profile/avatar', {
          method: 'POST',
          body: form,
        });
        const photoData = await photoResponse.json().catch(() => ({}));
        if (!photoResponse.ok) throw new Error(photoData.error || 'Could not upload your photo.');
      }

      setSaved(true);
      setPhoto(null);
      router.refresh();
      if (nextPath !== '/portal/profile') router.replace(nextPath);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not save your profile.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-strong bg-surface-raised text-cream-500">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="Profile portrait preview"
              fill
              sizes="96px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <UserRound className="h-9 w-9" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <label htmlFor="profile-photo" className="btn btn-secondary btn-sm cursor-pointer">
            <Camera className="h-4 w-4" aria-hidden="true" />
            Choose profile photo
          </label>
          <input
            id="profile-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={loading}
            onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
          />
          <p className="mt-2 text-[11.5px] text-cream-500">JPG, PNG, or WebP · up to 4 MB · required for certificates</p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="profile-name" className="mb-1.5 block text-xs text-cream-300">
            Full name
          </label>
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="mb-1.5 block text-xs text-cream-300">
            Email address
          </label>
          <input id="profile-email" type="email" value={email} className="field opacity-75" readOnly />
        </div>
        <div>
          <label htmlFor="profile-birthday" className="mb-1.5 block text-xs text-cream-300">
            Birthday
          </label>
          <input
            id="profile-birthday"
            type="date"
            autoComplete="bday"
            max={today}
            value={birthday}
            onChange={(event) => setBirthday(event.target.value)}
            className="field"
            required
            disabled={loading}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="profile-address" className="mb-1.5 block text-xs text-cream-300">
            Address
          </label>
          <textarea
            id="profile-address"
            autoComplete="street-address"
            minLength={5}
            maxLength={300}
            rows={3}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="field h-auto py-3 leading-relaxed"
            required
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-xs text-red-200">
          {error}
        </p>
      )}
      {saved && !error && (
        <p role="status" className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
          <Check className="h-4 w-4" aria-hidden="true" />
          Profile saved.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-line-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11.5px] leading-relaxed text-cream-500">
          Your birthday and address stay in your private account profile.
        </p>
        <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          Save profile
        </button>
      </div>
    </form>
  );
}
