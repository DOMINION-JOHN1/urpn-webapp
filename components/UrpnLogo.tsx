import React from 'react';
import Image from 'next/image';

interface UrpnLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { box: 'h-10 w-10', title: 'text-lg', sub: 'text-[7px]' },
  md: { box: 'h-12 w-12', title: 'text-xl sm:text-2xl', sub: 'text-[8px] sm:text-[9px]' },
  lg: { box: 'h-16 w-16', title: 'text-3xl', sub: 'text-[10px]' },
};

/**
 * The official URPN emblem — the actual gold menorah / shofar / laurel mark.
 */
export const UrpnLogo: React.FC<UrpnLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const s = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <span className={`relative ${s.box} shrink-0`}>
        <Image
          src="/urpn-logo-mark.png"
          alt="URPN — Unique Revival Prayer Network emblem"
          fill
          sizes="64px"
          priority
          className="object-contain drop-shadow-[0_2px_14px_rgba(237,165,30,0.35)]"
        />
      </span>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className={`font-cinzel font-bold tracking-[0.2em] text-gold-sheen ${s.title}`}>
            URPN
          </span>
          <span
            className={`font-sans font-semibold uppercase tracking-[0.18em] text-bronze-300/90 mt-1 ${s.sub}`}
          >
            Unique Revival Prayer Network
          </span>
        </div>
      )}
    </div>
  );
};
