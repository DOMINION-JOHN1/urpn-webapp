'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

export function SignOutButton({
  compact = false,
  redirectTo = '/',
}: {
  compact?: boolean;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push(redirectTo);
      router.refresh();
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={signOut}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-cream-400 transition-colors hover:text-cream-50"
        aria-label="Sign out"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] text-cream-400 transition-colors hover:bg-cream-50/[0.04] hover:text-cream-50 disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
      Sign out
    </button>
  );
}
