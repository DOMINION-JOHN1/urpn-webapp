'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  label?: string;
  className?: string;
}

export function EnrollButton({
  courseId,
  courseSlug,
  label = 'Start this track',
  className = 'btn btn-primary',
}: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/portal/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not start the track.');
      router.push(`/portal/courses/${courseSlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start the track.');
      setLoading(false);
    }
  };

  return (
    <div className={className.includes('w-full') ? 'w-full' : undefined}>
      <button
        type="button"
        onClick={enroll}
        disabled={loading}
        className={`${className} disabled:opacity-60`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Starting…
          </>
        ) : (
          <>
            {label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
      {error && <p className="mt-2 text-[11px] text-red-300">{error}</p>}
    </div>
  );
}
