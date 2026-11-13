import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

export function LockedCertificatePreview({
  title,
  courseHref,
  progress,
  enrolled,
}: {
  title: string;
  courseHref: string;
  progress: number;
  enrolled: boolean;
}) {
  const unlockCopy =
    progress === 100
      ? 'Pass the final exam to unlock your certificate.'
      : 'Complete the course and pass the final exam to unlock.';

  return (
    <article className="overflow-hidden border border-line bg-surface">
      <div className="relative m-3 aspect-[1.45/1] overflow-hidden border border-[#cfc5ac] bg-[#f7f3e9] p-4 text-[#2b2521] sm:m-4 sm:p-6">
        <div className="pointer-events-none absolute inset-2 border border-[#a99569]/45 sm:inset-3" />
        <div
          aria-hidden="true"
          className="relative flex h-full flex-col items-center justify-center text-center blur-[2.5px]"
        >
          <Image src="/brand/urpn-mark.png" alt="" width={40} height={40} className="object-contain" />
          <p className="mt-1 text-[9px] font-semibold tracking-[0.2em] sm:text-[11px]">URPN</p>
          <p className="mt-3 font-mono text-[7px] uppercase tracking-[0.22em] text-[#71654e] sm:text-[9px]">
            Certificate of completion
          </p>
          <p className="mt-3 text-[9px] text-[#71654e] sm:text-[11px]">Presented to</p>
          <p className="mt-1 max-w-full truncate border-b border-[#b6a77e] px-4 pb-1 font-serif text-[15px] sm:text-[20px]">
            Your name
          </p>
          <p className="mt-2 max-w-full truncate font-serif text-[10px] sm:text-[13px]">{title}</p>
          <p className="mt-2 font-mono text-[6px] uppercase tracking-[0.15em] text-[#71654e] sm:text-[8px]">
            Training · Examination · Passed
          </p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-[#17111a]/35 backdrop-blur-[1px]">
          <span className="inline-flex items-center gap-2 border border-white/30 bg-[#1a1119]/85 px-3 py-2 text-[11px] font-medium text-white sm:px-4 sm:text-xs">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Locked preview
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <h2 className="text-[14px] font-semibold text-cream-50">{title}</h2>
        <p className="mt-1 text-[11.5px] leading-relaxed text-cream-400">{unlockCopy}</p>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line-soft pt-3">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-cream-500">
            {enrolled ? `${progress}% complete` : 'Not started'}
          </span>
          <Link
            href={courseHref}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-accent hover:underline"
          >
            {enrolled ? 'Continue' : 'Start course'}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
